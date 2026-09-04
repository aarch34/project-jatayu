/**
 * PROJECT JATAYU 3.0 — QUIZ VALIDATOR & ANTI-CHEATING ENGINE
 * Randomizes questions & options while ensuring server-style verification.
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
 * Initializes a randomized quiz session for a user.
 * Shuffles question order per level and shuffles option order for each question.
 * Stores a secure internal mapping for verification.
 */
export function createQuizSession() {
  const sessionQuestions = [];

  // Process level by level (5 questions per level)
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
        // Hidden mapping to verify answer without exposing answer key directly
        _correctShuffledIndex: shuffledOptions.findIndex((o) => o.originalIndex === q.correctIndex),
        _originalQuestionId: q.id,
      });
    });
  });

  return {
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    startTime: Date.now(),
    questions: sessionQuestions,
  };
}

/**
 * Calculates achievement title based purely on objective score.
 */
export function getAchievementBadge(score) {
  if (score >= 250) {
    return {
      title: 'GUARDIAN OF THE SKIES',
      description: 'Mastery level! You hold deep conservation knowledge of Jatayu.',
      badgeClass: 'badge-guardian',
    };
  } else if (score >= 200) {
    return {
      title: 'CONSERVATION CHAMPION',
      description: 'Exceptional score! You are a champion for wildlife preservation.',
      badgeClass: 'badge-champion',
    };
  } else if (score >= 100) {
    return {
      title: 'VULTURE EXPLORER',
      description: 'Great effort! You have built a strong understanding of vulture ecology.',
      badgeClass: 'badge-explorer',
    };
  } else {
    return {
      title: 'CURIOUS OBSERVER',
      description: 'A solid start to your conservation learning journey.',
      badgeClass: 'badge-curious',
    };
  }
}

/**
 * Validates user answers server-style and calculates score breakdown.
 * @param {Object} session - The active quiz session created by createQuizSession()
 * @param {Object} userAnswers - Map of questionId => selectedShuffledIndex (0-3)
 * @param {number} endTime - Timestamp when user finished quiz
 */
export function evaluateQuizSession(session, userAnswers, endTime = Date.now()) {
  let totalScore = 0;
  let totalCorrect = 0;
  
  const levelBreakdown = {
    1: { correct: 0, total: 5, pointsEarned: 0 },
    2: { correct: 0, total: 5, pointsEarned: 0 },
    3: { correct: 0, total: 5, pointsEarned: 0 },
  };

  session.questions.forEach((q) => {
    const selectedIdx = userAnswers[q.id];
    const isCorrect = selectedIdx !== undefined && selectedIdx === q._correctShuffledIndex;

    const levelInfo = QUIZ_LEVELS.find((l) => l.id === q.level);
    const points = isCorrect ? (levelInfo ? levelInfo.pointsPerQuestion : 10) : 0;

    if (isCorrect) {
      totalScore += points;
      totalCorrect += 1;
      if (levelBreakdown[q.level]) {
        levelBreakdown[q.level].correct += 1;
        levelBreakdown[q.level].pointsEarned += points;
      }
    }
  });

  const timeTakenSeconds = Math.max(1, Math.round((endTime - session.startTime) / 1000));
  const achievement = getAchievementBadge(totalScore);

  return {
    totalScore, // Max 300
    totalQuestions: session.questions.length, // 15
    totalCorrect,
    levelBreakdown,
    timeTakenSeconds,
    achievement,
    completedAt: new Date(endTime).toISOString(),
  };
}
