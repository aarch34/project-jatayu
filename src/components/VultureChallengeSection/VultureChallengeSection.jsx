import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { QUIZ_LEVELS } from './quizData';
import { createQuizSession, evaluateQuizSession } from './quizValidator';
import {
  getLeaderboardEntries,
  saveLeaderboardEntry,
  filterLeaderboard,
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

  // Live running score display
  const [liveScore, setLiveScore] = useState(0);

  // Quiz evaluation results & leaderboard
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [lbFilterTab, setLbFilterTab] = useState('ALL');

  useEffect(() => {
    // Load initial leaderboard
    setLeaderboardEntries(getLeaderboardEntries());
  }, []);

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
      setNameError('Please enter your full name to start the challenge.');
      return;
    }
    setNameError('');

    // Create session with randomized questions and option orders
    const newSession = createQuizSession();
    setSession(newSession);
    setCurrentLevelId(1);
    setCurrentQuestionIndexInLevel(0);
    setUserAnswers({});
    setSelectedOptionForCurrent(null);
    setLiveScore(0);
    setViewState('play');
  };

  // Current level questions subset
  const currentLevelQuestions = session
    ? session.questions.filter((q) => q.level === currentLevelId)
    : [];
  const currentQuestion = currentLevelQuestions[currentQuestionIndexInLevel];

  // Option selection
  const handleOptionSelect = (optionIndex) => {
    setSelectedOptionForCurrent(optionIndex);
  };

  // Move to next question or complete level
  const handleNextQuestion = () => {
    if (selectedOptionForCurrent === null || !currentQuestion) return;

    // Save answer
    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: selectedOptionForCurrent,
    };
    setUserAnswers(newAnswers);

    // Check if correct live to update subtle score counter
    const isCorrect = selectedOptionForCurrent === currentQuestion._correctShuffledIndex;
    if (isCorrect) {
      const levelObj = QUIZ_LEVELS.find((l) => l.id === currentLevelId);
      const points = levelObj ? levelObj.pointsPerQuestion : 10;
      setLiveScore((prev) => prev + points);
    }

    // Reset selected option state for next question
    setSelectedOptionForCurrent(null);

    // Check if there are more questions in this level
    if (currentQuestionIndexInLevel < currentLevelQuestions.length - 1) {
      setCurrentQuestionIndexInLevel((prev) => prev + 1);
    } else {
      // Level Completed!
      const completedLevelObj = QUIZ_LEVELS.find((l) => l.id === currentLevelId);
      setCompletedLevelInfo(completedLevelObj);

      if (currentLevelId < 3) {
        setViewState('level-unlock');
      } else {
        // All 3 levels complete! Evaluate session
        finishQuiz(newAnswers);
      }
    }
  };

  // Unlock and start next level
  const handleProceedToNextLevel = () => {
    const nextLevelId = currentLevelId + 1;
    setCurrentLevelId(nextLevelId);
    setCurrentQuestionIndexInLevel(0);
    setSelectedOptionForCurrent(null);
    setViewState('play');
  };

  // Evaluate final quiz and save to persistent leaderboard
  const finishQuiz = (finalAnswers) => {
    const evalResults = evaluateQuizSession(session, finalAnswers);
    setFinalEvaluation(evalResults);

    // Save to leaderboard
    const updatedLb = saveLeaderboardEntry({
      name: playerName,
      club: isNotRotaractor ? 'Participant' : (rotaractClub || 'Participant'),
      isRotaractor: !isNotRotaractor,
      score: evalResults.totalScore,
      totalCorrect: evalResults.totalCorrect,
      levelBreakdown: evalResults.levelBreakdown,
      timeTakenSeconds: evalResults.timeTakenSeconds,
      completedAt: evalResults.completedAt,
    });

    setLeaderboardEntries(updatedLb);
    setViewState('results');
  };

  const handleOpenLeaderboard = () => {
    setLeaderboardEntries(getLeaderboardEntries());
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
              INTERNATIONAL VULTURE AWARENESS DAY CHALLENGE
            </div>

            <h2 className="quiz-title">THE VULTURE CHALLENGE</h2>

            <p className="quiz-subtitle">
              "How much do you know about the guardians of our skies?"
            </p>

            <p className="quiz-copy">
              Test what you've learned about vultures, their essential role in our ecosystems, the severe threats they face, and how real-world conservation can help bring them back from the brink of extinction.
            </p>

            <button
              type="button"
              className="quiz-primary-btn"
              onClick={handleStartIntro}
            >
              <span>TAKE THE CHALLENGE &rarr;</span>
            </button>
          </div>
        )}

        {/* ===================================================================
            2. PLAYER REGISTRATION STATE
            =================================================================== */}
        {viewState === 'register' && (
          <div className="quiz-card quiz-reg-card">
            <div className="quiz-reg-header">
              <h3 className="quiz-reg-title">PLAYER REGISTRATION</h3>
              <p className="quiz-reg-desc">
                Identify yourself on the leaderboard before taking the challenge.
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
            3. QUIZ PLAY STATE
            =================================================================== */}
        {viewState === 'play' && currentQuestion && (
          <div className="quiz-card quiz-play-card">
            {/* Top Bar: Level Badge & Subtle Live Score */}
            <div className="quiz-play-topbar">
              <div className={`level-indicator-badge level-${currentLevelId}`}>
                <Shield size={14} />
                <span>
                  LEVEL 0{currentLevelId}: {QUIZ_LEVELS[currentLevelId - 1].title} ({QUIZ_LEVELS[currentLevelId - 1].difficulty})
                </span>
              </div>

              <div className="quiz-score-subtle">
                <Trophy size={16} />
                <span>SCORE {liveScore}</span>
              </div>
            </div>

            {/* Question Counter */}
            <div className="question-counter">
              QUESTION 0{currentQuestionIndexInLevel + 1} / 0{currentLevelQuestions.length}
            </div>

            {/* Question Text */}
            <h3 className="question-text">{currentQuestion.question}</h3>

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
                    onClick={() => handleOptionSelect(idx)}
                  >
                    <span className="opt-prefix">{letter}</span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="quiz-play-actions">
              <button
                type="button"
                className="quiz-primary-btn"
                disabled={selectedOptionForCurrent === null}
                onClick={handleNextQuestion}
              >
                <span>NEXT &rarr;</span>
              </button>
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

            <h3 className="level-complete-title">LEVEL COMPLETE</h3>

            <p className="level-complete-msg">"{completedLevelInfo.unlockMessage}"</p>

            <button
              type="button"
              className="quiz-primary-btn"
              onClick={handleProceedToNextLevel}
            >
              <span>
                START LEVEL 0{currentLevelId + 1}: {QUIZ_LEVELS[currentLevelId].title} &rarr;
              </span>
            </button>
          </div>
        )}

        {/* ===================================================================
            5. FINAL RESULTS STATE
            =================================================================== */}
        {viewState === 'results' && finalEvaluation && (
          <div className="quiz-card quiz-results-card">
            <div className="results-top">
              <div className="quiz-badge">
                <Sparkles size={14} />
                <span>CHALLENGE COMPLETE</span>
              </div>
              <h2 className="results-title">YOU'VE COMPLETED THE VULTURE CHALLENGE.</h2>

              <div className="player-info-pill">
                <span className="name">{playerName}</span>
                <span className="divider">|</span>
                <span className="club">{rotaractClub || 'Participant'}</span>
              </div>
            </div>

            {/* Objective Score & Stats */}
            <div className="results-stats-grid">
              <div className="stat-box">
                <span className="stat-val">{finalEvaluation.totalScore}</span>
                <span className="stat-lbl">TOTAL SCORE / 300</span>
              </div>

              <div className="stat-box">
                <span className="stat-val">
                  {finalEvaluation.totalCorrect} / {finalEvaluation.totalQuestions}
                </span>
                <span className="stat-lbl">CORRECT ANSWERS</span>
              </div>

              <div className="stat-box">
                <span className="stat-val">{finalEvaluation.timeTakenSeconds}s</span>
                <span className="stat-lbl">TIME TAKEN</span>
              </div>
            </div>

            {/* Achievement Badge (Purely Objective Score Based) */}
            <div className="achievement-card">
              <span className="achievement-tag">ACHIEVEMENT UNLOCKED</span>
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

            {/* Secondary Action Row */}
            <div className="results-action-row">
              <button
                type="button"
                className="quiz-secondary-btn"
                onClick={handleOpenLeaderboard}
              >
                <Trophy size={16} />
                <span>VIEW LEADERBOARD</span>
              </button>

              <button
                type="button"
                className="quiz-secondary-btn"
                onClick={() => {
                  const meetSection = document.getElementById('meet-the-vulture');
                  if (meetSection) meetSection.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>LEARN MORE ABOUT PROJECT JATAYU &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            6. LEADERBOARD STATE
            =================================================================== */}
        {viewState === 'leaderboard' && (
          <div className="quiz-card leaderboard-card">
            <div className="leaderboard-header">
              <h2 className="leaderboard-title">THE VULTURE GUARDIANS</h2>
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
                ALL PARTICIPANTS
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

            {/* Leaderboard Table */}
            <div className="leaderboard-table-wrap">
              {activeFilteredLeaderboard.length === 0 ? (
                <div className="lb-empty-msg">No participants found in this category yet.</div>
              ) : (
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>NAME</th>
                      <th>ROTARACT CLUB</th>
                      <th>SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFilteredLeaderboard.map((item, index) => {
                      const rankNum = index + 1;
                      const rankClass = rankNum <= 3 ? `rank-${rankNum}` : '';

                      return (
                        <tr key={item.id || index}>
                          <td>
                            <span className={`rank-badge ${rankClass}`}>
                              {rankNum < 10 ? `0${rankNum}` : rankNum}
                            </span>
                          </td>
                          <td className="participant-name-col">{item.name}</td>
                          <td className="club-col">{item.club}</td>
                          <td className="score-col">{item.score}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Leaderboard Actions */}
            <div className="results-action-row" style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="quiz-secondary-btn"
                onClick={handleRetakeChallenge}
              >
                <RotateCcw size={16} />
                <span>RETAKE CHALLENGE</span>
              </button>

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
          </div>
        )}
      </div>
    </section>
  );
}
