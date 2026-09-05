import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Shield,
  Award,
  ChevronRight,
  UserCheck,
  Calendar,
  MapPin,
  ExternalLink,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { QUIZ_LEVELS } from './quizData';
import { createQuizSession, evaluateQuizSession } from './quizValidator';
import {
  fetchLeaderboardEntries,
  getLeaderboardEntries,
  saveLeaderboardEntry,
  filterLeaderboard,
  formatTime,
  getParticipantRank,
  subscribeLeaderboardUpdates,
} from './leaderboardStore';
import './VultureChallengeSection.css';

export default function VultureChallengeSection() {
  // Flow state: 'intro' | 'register' | 'play' | 'level-unlock' | 'results' | 'leaderboard'
  const [viewState, setViewState] = useState('intro');

  // Player info
  const [playerName, setPlayerName] = useState('');
  const [rotaractClub, setRotaractClub] = useState('');
  const [isNotRotaractor, setIsNotRotaractor] = useState(false);
  const [nameError, setNameError] = useState('');

  // Active quiz session & progress
  const [session, setSession] = useState(null);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentQuestionIndexInLevel, setCurrentQuestionIndexInLevel] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOptionForCurrent, setSelectedOptionForCurrent] = useState(null);
  const [completedLevelInfo, setCompletedLevelInfo] = useState(null);

  // Question Timer & Accumulated Time Tracking
  const [timeLeft, setTimeLeft] = useState(20);
  const [totalTimeSpentSeconds, setTotalTimeSpentSeconds] = useState(0);
  const [isQuestionLocked, setIsQuestionLocked] = useState(false);
  const timerRef = useRef(null);

  // Live running score display
  const [liveScore, setLiveScore] = useState(0);

  // Quiz evaluation results, attempt tracking & global leaderboard
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [activeAttemptId, setActiveAttemptId] = useState(null);
  const [calculatedRank, setCalculatedRank] = useState(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [lbFilterTab, setLbFilterTab] = useState('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial global leaderboard and subscribe to real-time updates
  useEffect(() => {
    const loadEntries = async () => {
      const data = await fetchLeaderboardEntries();
      setLeaderboardEntries(data);
    };
    loadEntries();

    const unsubscribe = subscribeLeaderboardUpdates((updatedData) => {
      setLeaderboardEntries(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Refresh leaderboard whenever viewing leaderboard screen
  useEffect(() => {
    if (viewState === 'leaderboard') {
      fetchLeaderboardEntries().then((data) => {
        setLeaderboardEntries(data);
      });
    }
  }, [viewState]);

  // Current level questions subset
  const currentLevelQuestions = session
    ? session.questions.filter((q) => q.level === currentLevelId)
    : [];
  const currentQuestion = currentLevelQuestions[currentQuestionIndexInLevel];

  // Handle per-question countdown timer interval and time accumulation
  useEffect(() => {
    if (viewState !== 'play' || !currentQuestion || isQuestionLocked) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const questionTimeLimit = currentQuestion.timeLimitSeconds || 20;
    setTimeLeft(questionTimeLimit);
    setIsQuestionLocked(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      // Accumulate time spent
      setTotalTimeSpentSeconds((prev) => prev + 1);

      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimerExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewState, currentLevelId, currentQuestionIndexInLevel, session]);

  // Handle automatic timer expiry (0 points, record unanswered, auto-advance)
  const handleTimerExpiry = () => {
    setIsQuestionLocked(true);
    if (!currentQuestion) return;

    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: null, // Unanswered due to timer expiry
    };
    setUserAnswers(newAnswers);

    setTimeout(() => {
      advanceQuestionFlow(newAnswers);
    }, 800);
  };

  // Update club field when non-Rotaractor checkbox toggles
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsNotRotaractor(checked);
    if (checked) {
      setRotaractClub('Participant');
    } else {
      setRotaractClub('');
    }
  };

  // Start Registration
  const handleStartIntro = () => {
    setViewState('register');
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setNameError('Please enter your full name to start the competition.');
      return;
    }
    setNameError('');

    // Create new session with unique attemptId
    const newSession = createQuizSession();
    setSession(newSession);
    setActiveAttemptId(newSession.sessionId);
    setCurrentLevelId(1);
    setCurrentQuestionIndexInLevel(0);
    setUserAnswers({});
    setSelectedOptionForCurrent(null);
    setIsQuestionLocked(false);
    setTotalTimeSpentSeconds(0);
    setLiveScore(0);
    setIsSubmitting(false);
    setViewState('play');
  };

  // Participant option selection
  const handleOptionSelect = (optionIndex) => {
    if (isQuestionLocked || selectedOptionForCurrent !== null) return;

    // Stop timer immediately and lock question
    if (timerRef.current) clearInterval(timerRef.current);
    setIsQuestionLocked(true);
    setSelectedOptionForCurrent(optionIndex);

    // Save answer
    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: optionIndex,
    };
    setUserAnswers(newAnswers);

    // Check if correct to update subtle live score counter
    const isCorrect = optionIndex === currentQuestion._correctShuffledIndex;
    if (isCorrect) {
      const levelObj = QUIZ_LEVELS.find((l) => l.id === currentLevelId);
      const points = levelObj ? levelObj.pointsPerQuestion : 10;
      setLiveScore((prev) => prev + points);
    }

    // Auto-advance to next question after brief 400ms feedback pause
    setTimeout(() => {
      advanceQuestionFlow(newAnswers);
    }, 400);
  };

  // Advance question or trigger round completion
  const advanceQuestionFlow = (latestAnswers) => {
    setSelectedOptionForCurrent(null);
    setIsQuestionLocked(false);

    if (currentQuestionIndexInLevel < currentLevelQuestions.length - 1) {
      setCurrentQuestionIndexInLevel((prev) => prev + 1);
    } else {
      // Round Completed!
      const completedLevelObj = QUIZ_LEVELS.find((l) => l.id === currentLevelId);
      setCompletedLevelInfo(completedLevelObj);

      if (currentLevelId < 3) {
        setViewState('level-unlock');
      } else {
        // All 3 rounds complete! Finish and evaluate quiz
        finishQuiz(latestAnswers);
      }
    }
  };

  // Unlock and start next round
  const handleProceedToNextLevel = () => {
    const nextLevelId = currentLevelId + 1;
    setCurrentLevelId(nextLevelId);
    setCurrentQuestionIndexInLevel(0);
    setSelectedOptionForCurrent(null);
    setIsQuestionLocked(false);
    setViewState('play');
  };

  // Evaluate final quiz, store exact stats, and save to global persistent API
  const finishQuiz = async (finalAnswers) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const evalResults = evaluateQuizSession(session, finalAnswers, totalTimeSpentSeconds);
    setFinalEvaluation(evalResults);

    const submissionData = {
      attemptId: session.sessionId,
      name: playerName,
      club: isNotRotaractor ? 'Participant' : (rotaractClub || 'Participant'),
      isRotaractor: !isNotRotaractor,
      correctAnswers: evalResults.correctAnswers,
      totalQuestions: evalResults.totalQuestions, // 15
      incorrectAnswers: evalResults.incorrectAnswers,
      unansweredQuestions: evalResults.unansweredQuestions,
      totalScore: evalResults.totalScore,
      score: evalResults.totalScore,
      totalTimeSeconds: evalResults.totalTimeSeconds,
      timeTakenSeconds: evalResults.totalTimeSeconds,
      completedAt: evalResults.completedAt,
    };

    // Save to disk-persisted global API endpoint
    const updatedGlobalEntries = await saveLeaderboardEntry(submissionData);
    setLeaderboardEntries(updatedGlobalEntries);

    // Calculate live position rank
    const playerRank = getParticipantRank(
      updatedGlobalEntries,
      session.sessionId,
      submissionData
    );
    setCalculatedRank(playerRank);

    setViewState('results');
    setIsSubmitting(false);
  };

  const handleOpenLeaderboard = () => {
    fetchLeaderboardEntries().then((data) => {
      setLeaderboardEntries(data);
    });
    setViewState('leaderboard');
  };

  const handleRetakeChallenge = () => {
    setViewState('intro');
  };

  const activeFilteredLeaderboard = filterLeaderboard(
    leaderboardEntries,
    lbFilterTab,
    rotaractClub || 'Participant'
  );

  // Compute timer urgency (when <= 5s)
  const isTimerUrgent = timeLeft <= 5 && viewState === 'play';
  const globalQuestionNumber = (currentLevelId - 1) * 5 + (currentQuestionIndexInLevel + 1);
  const maxQuestionTime = currentQuestion ? (currentQuestion.timeLimitSeconds || 20) : 20;
  const timeProgressPercent = Math.max(0, Math.min(100, (timeLeft / maxQuestionTime) * 100));

  return (
    <section id="vulture-challenge" className="quiz-section">
      {/* Background Environmental Visual Elements */}
      <div className="quiz-bg-environment">
        <div className="quiz-sunlight-ray"></div>
        <div className="quiz-mountain-bg"></div>

        {/* Flying Vulture Silhouettes */}
        <svg
          className="quiz-vulture-silhouette v1"
          width="50"
          height="30"
          viewBox="0 0 100 60"
          fill="currentColor"
        >
          <path d="M 0 30 Q 25 0, 50 30 Q 75 0, 100 30 Q 50 45, 0 30 Z" />
        </svg>
        <svg
          className="quiz-vulture-silhouette v2"
          width="40"
          height="24"
          viewBox="0 0 100 60"
          fill="currentColor"
        >
          <path d="M 0 30 Q 25 0, 50 30 Q 75 0, 100 30 Q 50 45, 0 30 Z" />
        </svg>
      </div>

      <div className="quiz-container">
        {/* ===================================================================
            1. INTRO STATE
            =================================================================== */}
        {viewState === 'intro' && (
          <div className="quiz-card quiz-intro-card">
            <div className="quiz-badge">
              <span className="dot"></span>
              COLLEGE COMPETITIVE CONSERVATION QUIZ
            </div>

            <h2 className="quiz-title">THE VULTURE CHALLENGE</h2>

            <p className="quiz-subtitle">
              "How much do you know about the guardians of our skies?"
            </p>

            <p className="quiz-copy">
              Test your scientific knowledge of vulture ecology, veterinary pharmacology, ecosystem disease cascades, and population recovery strategies across 3 timed competitive rounds.
            </p>

            {/* Round Preview Grid */}
            <div className="round-preview-grid">
              <div className="round-preview-item">
                <span className="rp-tag">ROUND 01</span>
                <span className="rp-title">VULTURE 101</span>
                <span className="rp-detail">20s / Q • 10 Pts</span>
              </div>
              <div className="round-preview-item">
                <span className="rp-tag">ROUND 02</span>
                <span className="rp-title">THE ECOLOGIST</span>
                <span className="rp-detail">25s / Q • 20 Pts</span>
              </div>
              <div className="round-preview-item">
                <span className="rp-tag">ROUND 03</span>
                <span className="rp-title">THE GUARDIAN</span>
                <span className="rp-detail">30s / Q • 30 Pts</span>
              </div>
            </div>

            {/* Intro Actions: Take Challenge or View Public Leaderboard */}
            <div className="intro-action-row">
              <button
                type="button"
                className="quiz-primary-btn"
                onClick={handleStartIntro}
              >
                <span>TAKE THE CHALLENGE &rarr;</span>
              </button>

              <button
                type="button"
                className="quiz-secondary-btn"
                onClick={handleOpenLeaderboard}
              >
                <Trophy size={16} />
                <span>SEE WHO'S LEADING &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            2. PLAYER REGISTRATION STATE
            =================================================================== */}
        {viewState === 'register' && (
          <div className="quiz-card quiz-reg-card">
            <div className="quiz-reg-header">
              <h3 className="quiz-reg-title">COMPETITOR REGISTRATION</h3>
              <p className="quiz-reg-desc">
                Enter your details to register your competitive score and completion time on the global leaderboard.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="full-name-input">
                  FULL NAME *
                </label>
                <input
                  id="full-name-input"
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                {nameError && <span className="error-text">{nameError}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="club-input">
                  ROTARACT CLUB
                </label>
                <input
                  id="club-input"
                  type="text"
                  className="form-input"
                  placeholder="Enter your Rotaract Club"
                  value={rotaractClub}
                  onChange={(e) => setRotaractClub(e.target.value)}
                  disabled={isNotRotaractor}
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={isNotRotaractor}
                  onChange={handleCheckboxChange}
                />
                <span>I'm not a Rotaractor</span>
              </label>

              <button type="submit" className="quiz-primary-btn" style={{ width: '100%', marginTop: '1rem' }}>
                <span>START THE CHALLENGE &rarr;</span>
              </button>
            </form>
          </div>
        )}

        {/* ===================================================================
            3. QUIZ PLAY STATE (ENFORCED TIMER & QUESTIONS)
            =================================================================== */}
        {viewState === 'play' && currentQuestion && (
          <div className="quiz-card quiz-play-card">
            {/* Top Bar: Round Info, Global Question Counter & Countdown Timer */}
            <div className="quiz-play-header">
              <div className="round-info-group">
                <div className="round-badge">
                  <Shield size={14} />
                  <span>
                    {QUIZ_LEVELS[currentLevelId - 1].code} — {QUIZ_LEVELS[currentLevelId - 1].title}
                  </span>
                </div>
                <div className="question-tracker">
                  QUESTION {globalQuestionNumber < 10 ? `0${globalQuestionNumber}` : globalQuestionNumber} / 15
                </div>
              </div>

              {/* Per-Question Digital Countdown Timer */}
              <div className={`timer-container ${isTimerUrgent ? 'urgent' : ''}`}>
                <Clock size={18} className="timer-icon" />
                <span className="timer-digits">
                  {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
                </span>
              </div>
            </div>

            {/* Timer Progress Fill Line */}
            <div className="timer-progress-track">
              <div
                className={`timer-progress-fill ${isTimerUrgent ? 'urgent' : ''}`}
                style={{ width: `${timeProgressPercent}%` }}
              ></div>
            </div>

            {/* Scenario Question Text */}
            <h3 className="scenario-question-text">{currentQuestion.question}</h3>

            {/* Answers Grid */}
            <div className="answers-grid">
              {currentQuestion.options.map((optText, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selectedOptionForCurrent === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`answer-option-btn ${isSelected ? 'selected' : ''}`}
                    disabled={isQuestionLocked}
                    onClick={() => handleOptionSelect(idx)}
                  >
                    <span className="opt-prefix">{letter}</span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Score Display Footer */}
            <div className="quiz-score-display" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Trophy size={16} />
              <span>SCORE: {liveScore}</span>
            </div>
          </div>
        )}

        {/* ===================================================================
            4. LEVEL UNLOCK INTERSTITIAL STATE
            =================================================================== */}
        {viewState === 'level-unlock' && completedLevelInfo && (
          <div className="quiz-card level-unlock-card">
            <div className="unlock-icon-wrap">
              <CheckCircle size={36} />
            </div>

            <h3 className="level-complete-title">{completedLevelInfo.code} COMPLETE</h3>

            <p className="level-complete-msg">"{completedLevelInfo.unlockMessage}"</p>

            <button
              type="button"
              className="quiz-primary-btn"
              onClick={handleProceedToNextLevel}
            >
              <span>
                START {QUIZ_LEVELS[currentLevelId].code}: {QUIZ_LEVELS[currentLevelId].title} &rarr;
              </span>
            </button>
          </div>
        )}

        {/* ===================================================================
            5. FINAL RESULTS & LIVE RANK SCREEN
            =================================================================== */}
        {viewState === 'results' && finalEvaluation && (
          <div className="quiz-card quiz-results-card">
            <div className="results-top">
              <div className="quiz-badge">
                <Sparkles size={14} />
                <span>THE VULTURE GUARDIANS</span>
              </div>
              <h2 className="results-title">YOUR RESULT</h2>

              <div className="player-info-pill">
                <span className="name">{playerName}</span>
                <span className="divider">|</span>
                <span className="club">{rotaractClub || 'Participant'}</span>
              </div>
            </div>

            {/* Stats Grid: Correct Answers, Score, Time, and Global Rank */}
            <div className="results-stats-grid">
              <div className="stat-box">
                <span className="stat-val">
                  {finalEvaluation.correctAnswers} / {finalEvaluation.totalQuestions}
                </span>
                <span className="stat-lbl">CORRECT ANSWERS</span>
              </div>

              <div className="stat-box">
                <span className="stat-val">{finalEvaluation.totalScore} / 300</span>
                <span className="stat-lbl">SCORE</span>
              </div>

              <div className="stat-box">
                <span className="stat-val">{formatTime(finalEvaluation.totalTimeSeconds)}</span>
                <span className="stat-lbl">TIME</span>
              </div>

              <div className="stat-box rank-box">
                <span className="stat-val">#{calculatedRank || 1}</span>
                <span className="stat-lbl">GLOBAL RANK</span>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="achievement-card">
              <span className="achievement-tag">PERFORMANCE LEVEL</span>
              <h3 className="achievement-title">{finalEvaluation.achievement.title}</h3>
              <p className="achievement-desc">{finalEvaluation.achievement.description}</p>
            </div>

            {/* Real-World Connection to Event */}
            <div className="real-event-card">
              <span className="event-lead-text">"Ready to see them beyond the screen?"</span>
              <h4 className="event-main-title">
                PROJECT JATAYU 3.0 VULTURE OBSERVATION & AWARENESS TREK
              </h4>

              <div className="event-date-row">
                <div className="event-date-item">
                  <span className="date-lbl">INTERNATIONAL VULTURE AWARENESS DAY</span>
                  <span className="date-val">September 5, 2026</span>
                </div>
                <div className="event-date-item">
                  <span className="date-lbl">OBSERVATION TREK DATE</span>
                  <span className="date-val">September 6, 2026 | 8:00 AM – 2:00 PM</span>
                </div>
                <div className="event-date-item">
                  <span className="date-lbl">LOCATION</span>
                  <span className="date-val">Ramadevara Betta, Ramanagara</span>
                </div>
              </div>

              <a
                href="https://forms.gle/uwx9YqtKBdHVku8J7"
                target="_blank"
                rel="noopener noreferrer"
                className="quiz-primary-btn"
                style={{ textDecoration: 'none' }}
              >
                <span>JOIN THE JATAYU TREK &rarr;</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Action Row */}
            <div className="results-action-row">
              <button
                type="button"
                className="quiz-primary-btn"
                onClick={handleOpenLeaderboard}
              >
                <Trophy size={16} />
                <span>VIEW GLOBAL LEADERBOARD &rarr;</span>
              </button>

              <button
                type="button"
                className="quiz-secondary-btn"
                onClick={handleRetakeChallenge}
              >
                <RotateCcw size={16} />
                <span>RETAKE CHALLENGE</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            6. PUBLIC GLOBAL LEADERBOARD STATE
            =================================================================== */}
        {viewState === 'leaderboard' && (
          <div className="quiz-card leaderboard-card">
            <div className="leaderboard-header">
              <div className="live-status-pill">
                <span className="live-pulse-dot"></span>
                <span>LIVE LEADERBOARD</span>
              </div>
              <span className="live-subtext">Updated as participants complete the challenge.</span>

              <h2 className="leaderboard-title" style={{ marginTop: '0.35rem' }}>
                THE VULTURE GUARDIANS
              </h2>
              <p className="leaderboard-subtitle">
                "Who knows the most about the guardians of our skies?"
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="leaderboard-tabs">
              <button
                type="button"
                className={`lb-tab-btn ${lbFilterTab === 'ALL' ? 'active' : ''}`}
                onClick={() => setLbFilterTab('ALL')}
              >
                ALL
              </button>
              <button
                type="button"
                className={`lb-tab-btn ${lbFilterTab === 'ROTARACTORS' ? 'active' : ''}`}
                onClick={() => setLbFilterTab('ROTARACTORS')}
              >
                ROTARACTORS
              </button>
              <button
                type="button"
                className={`lb-tab-btn ${lbFilterTab === 'MY_CLUB' ? 'active' : ''}`}
                onClick={() => setLbFilterTab('MY_CLUB')}
              >
                MY CLUB
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="leaderboard-table-wrap">
              {activeFilteredLeaderboard.length === 0 ? (
                <div className="lb-empty-msg">No participants on the global leaderboard yet. Be the first to take the challenge!</div>
              ) : (
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>NAME</th>
                      <th>ROTARACT CLUB</th>
                      <th>CORRECT</th>
                      <th>SCORE</th>
                      <th>TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFilteredLeaderboard.map((item, index) => {
                      const rankNum = index + 1;
                      const rankClass = rankNum <= 3 ? `rank-${rankNum}` : '';
                      const isCurrentUser =
                        (activeAttemptId && item.attemptId === activeAttemptId) ||
                        (playerName && item.name.trim().toLowerCase() === playerName.trim().toLowerCase());

                      const correctVal = item.correctAnswers !== undefined ? item.correctAnswers : (item.totalCorrect || 0);
                      const totalQ = item.totalQuestions || 15;
                      const scoreVal = item.totalScore !== undefined ? item.totalScore : (item.score || 0);
                      const timeSecs = item.totalTimeSeconds !== undefined ? item.totalTimeSeconds : (item.timeTakenSeconds || 0);

                      return (
                        <tr
                          key={item.attemptId || item.id || index}
                          className={isCurrentUser ? 'current-user-row' : ''}
                        >
                          <td>
                            <span className={`rank-badge ${rankClass}`}>
                              {rankNum < 10 ? `0${rankNum}` : rankNum}
                            </span>
                          </td>
                          <td className="participant-name-col">
                            <span>{item.name}</span>
                            {isCurrentUser && <span className="current-user-tag">YOU</span>}
                          </td>
                          <td className="club-col">{item.club}</td>
                          <td className="correct-col">{correctVal}/{totalQ}</td>
                          <td className="score-col">{scoreVal}</td>
                          <td className="time-col">{formatTime(timeSecs)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Responsive List Cards View */}
            <div className="leaderboard-mobile-list">
              {activeFilteredLeaderboard.length === 0 ? (
                <div className="lb-empty-msg">No participants on the global leaderboard yet.</div>
              ) : (
                activeFilteredLeaderboard.map((item, index) => {
                  const rankNum = index + 1;
                  const isCurrentUser =
                    (activeAttemptId && item.attemptId === activeAttemptId) ||
                    (playerName && item.name.trim().toLowerCase() === playerName.trim().toLowerCase());

                  const correctVal = item.correctAnswers !== undefined ? item.correctAnswers : (item.totalCorrect || 0);
                  const scoreVal = item.totalScore !== undefined ? item.totalScore : (item.score || 0);
                  const timeSecs = item.totalTimeSeconds !== undefined ? item.totalTimeSeconds : (item.timeTakenSeconds || 0);

                  return (
                    <div
                      key={item.attemptId || item.id || index}
                      className={`lb-mobile-card ${isCurrentUser ? 'current-user-card' : ''}`}
                    >
                      <div className="lb-m-top">
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
                          <span className={`rank-badge ${rankNum <= 3 ? `rank-${rankNum}` : ''}`}>
                            {rankNum < 10 ? `0${rankNum}` : rankNum}
                          </span>
                          <div>
                            <div className="lb-m-name">
                              {item.name} {isCurrentUser && <span className="current-user-tag">YOU</span>}
                            </div>
                            <div className="lb-m-club">{item.club}</div>
                          </div>
                        </div>
                      </div>

                      <div className="lb-m-stats">
                        <div className="lb-m-stat-item">
                          <span className="lb-m-lbl">CORRECT</span>
                          <span className="lb-m-val">{correctVal}/15</span>
                        </div>
                        <div className="lb-m-stat-item">
                          <span className="lb-m-lbl">SCORE</span>
                          <span className="lb-m-val">{scoreVal}</span>
                        </div>
                        <div className="lb-m-stat-item">
                          <span className="lb-m-lbl">TIME</span>
                          <span className="lb-m-val">{formatTime(timeSecs)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Competition Conversion Card */}
            <div className="bottom-conversion-card">
              <h3 className="conv-title">THINK YOU CAN DO BETTER?</h3>
              <p className="conv-copy">
                Test your knowledge of India's vultures, their ecosystems and the conservation challenges they face.
              </p>

              <div className="results-action-row" style={{ width: '100%' }}>
                <button
                  type="button"
                  className="quiz-primary-btn"
                  onClick={handleStartIntro}
                >
                  <span>TAKE THE VULTURE CHALLENGE &rarr;</span>
                </button>

                <a
                  href="https://forms.gle/uwx9YqtKBdHVku8J7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiz-secondary-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <span>JOIN THE JATAYU TREK &rarr;</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
