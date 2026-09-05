/**
 * PROJECT JATAYU 3.0 — QUIZ VALIDATOR & ANTI-CHEATING ENGINE
 * Handles Fisher-Yates randomisation, server-style score verification, and exact stats calculations.
 */
import { RAW_QUESTIONS, QUIZ_LEVELS } from './quizData';

/**
 * Standard Fisher-Yates shuffle
 */
function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Initializes a randomized quiz session for a participant.
 * Shuffles question order per round and option order per question.
 */
export function createQuizSession() {
  const sessionQuestions = [];
  const sessionId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // Process level by level (5 questions per round)
  QUIZ_LEVELS.forEach((levelObj) => {
    const levelRawQuestions = RAW_QUESTIONS.filter((q) => q.level === levelObj.id);
    const shuffledLevelQuestions = shuffleArray(levelRawQuestions);

    shuffledLevelQuestions.forEach((q) => {
      // Map original options to objects with original index
      const indexedOptions = q.options.map((optText, origIdx) => ({
        text: optText,
        originalIndex: origIdx,
      }));

      const shuffledOptions = shuffleArray(indexedOptions);

      sessionQuestions.push({
        id: q.id,
        level: q.level,
        question: q.question,
        options: shuffledOptions.map((o) => o.text), // Array of option strings in shuffled order
        timeLimitSeconds: levelObj.timeLimitSeconds || 20,
        _correctShuffledIndex: shuffledOptions.findIndex((o) => o.originalIndex === q.correctIndex),
        _originalQuestionId: q.id,
      });
    });
  });

  return {
    sessionId,
    startTime: Date.now(),
    questions: sessionQuestions,
  };
}

/**
 * Calculates performance title based purely on objective score out of 300.
 */
export function getAchievementBadge(score) {
  if (score >= 280) {
    return {
      title: 'GUARDIAN OF THE SKIES',
      description: 'Mastery score! You demonstrate elite conservation science knowledge.',
      badgeClass: 'badge-skies',
    };
  } else if (score >= 240) {
    return {
      title: 'VULTURE GUARDIAN',
      description: 'Exceptional competitive score! You have deep mastery of vulture protection.',
      badgeClass: 'badge-guardian',
    };
  } else if (score >= 180) {
    return {
      title: 'CONSERVATION CHAMPION',
      description: 'Strong result! You demonstrate solid command of ecological science.',
      badgeClass: 'badge-champion',
    };
  } else if (score >= 100) {
    return {
      title: 'VULTURE EXPLORER',
      description: 'Good effort! You understand core ecological and threat concepts.',
      badgeClass: 'badge-explorer',
    };
  } else {
    return {
      title: 'CURIOUS OBSERVER',
      description: 'A starting step into the world of avian conservation science.',
      badgeClass: 'badge-curious',
    };
  }
}

/**
 * Validates user answers server-style and calculates complete statistical metrics.
 * @param {Object} session - The active quiz session created by createQuizSession()
 * @param {Object} userAnswers - Map of questionId => selectedShuffledIndex (0-3 or null if timed out)
 * @param {number} totalTimeTakenSeconds - Actual accumulated seconds spent across all questions
 * @param {number} endTime - Timestamp when user finished quiz
 */
export function evaluateQuizSession(session, userAnswers, totalTimeTakenSeconds = 0, endTime = Date.now()) {
  let totalScore = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredQuestions = 0;

  const levelBreakdown = {
    1: { correct: 0, total: 5, pointsEarned: 0 },
    2: { correct: 0, total: 5, pointsEarned: 0 },
    3: { correct: 0, total: 5, pointsEarned: 0 },
  };

  session.questions.forEach((q) => {
    const selectedIdx = userAnswers[q.id];
    if (selectedIdx === null || selectedIdx === undefined) {
      unansweredQuestions += 1;
      return;
    }

    const isCorrect = selectedIdx === q._correctShuffledIndex;
    const levelInfo = QUIZ_LEVELS.find((l) => l.id === q.level);
    const points = isCorrect ? (levelInfo ? levelInfo.pointsPerQuestion : 10) : 0;

    if (isCorrect) {
      totalScore += points;
      correctAnswers += 1;
      if (levelBreakdown[q.level]) {
        levelBreakdown[q.level].correct += 1;
        levelBreakdown[q.level].pointsEarned += points;
      }
    } else {
      incorrectAnswers += 1;
    }
  });

  const finalTimeSeconds = totalTimeTakenSeconds > 0
    ? totalTimeTakenSeconds
    : Math.max(1, Math.round((endTime - session.startTime) / 1000));

  const achievement = getAchievementBadge(totalScore);

  return {
    attemptId: session.sessionId,
    totalScore, // Max 300
    totalQuestions: session.questions.length, // 15
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    levelBreakdown,
    totalTimeSeconds: finalTimeSeconds,
    timeTakenSeconds: finalTimeSeconds,
    achievement,
    completedAt: new Date(endTime).toISOString(),
  };
}
