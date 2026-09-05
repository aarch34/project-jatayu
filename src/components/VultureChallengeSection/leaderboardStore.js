/**
 * PROJECT JATAYU 3.0 — PERSISTENT GLOBAL LEADERBOARD STORE
 * Shared API sync, BroadcastChannel real-time tab updates, and 3-tier tie-breaking.
 */

const STORAGE_KEY = 'jatayu_vulture_challenge_leaderboard_v1';
const BROADCAST_CHANNEL_NAME = 'jatayu_leaderboard_channel';

let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported in this environment');
  }
}

/**
 * Format total seconds into MM:SS string (e.g., 205 -> "03:25")
 */
export function formatTime(seconds = 0) {
  const secs = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  const mm = mins < 10 ? `0${mins}` : `${mins}`;
  const ss = remSecs < 10 ? `0${remSecs}` : `${remSecs}`;
  return `${mm}:${ss}`;
}

/**
 * Sort leaderboard entries using exact 3-tier competitive rules:
 * 1. PRIMARY: correctAnswers (DESC)
 * 2. SECONDARY: totalScore (DESC)
 * 3. TERTIARY: totalTimeSeconds (ASC: lower is faster)
 */
export function sortLeaderboardEntries(entries = []) {
  const realEntries = entries.filter((item) => !item.id || !item.id.startsWith('entry_init_'));

  return [...realEntries].sort((a, b) => {
    // 1. Primary: Correct Answers (Higher is better)
    const correctA = a.correctAnswers !== undefined ? a.correctAnswers : (a.totalCorrect || 0);
    const correctB = b.correctAnswers !== undefined ? b.correctAnswers : (b.totalCorrect || 0);
    if (correctB !== correctA) {
      return correctB - correctA;
    }

    // 2. Secondary: Total Score (Higher is better)
    const scoreA = a.totalScore !== undefined ? a.totalScore : (a.score || 0);
    const scoreB = b.totalScore !== undefined ? b.totalScore : (b.score || 0);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // 3. Tertiary: Total Time Taken (Lower is better)
    const timeA = a.totalTimeSeconds !== undefined ? a.totalTimeSeconds : (a.timeTakenSeconds || 9999);
    const timeB = b.totalTimeSeconds !== undefined ? b.totalTimeSeconds : (b.timeTakenSeconds || 9999);
    return timeA - timeB;
  });
}

/**
 * Loads leaderboard entries from backend API (/api/leaderboard) or fallback localStorage.
 */
export async function fetchLeaderboardEntries() {
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const data = await res.json();
      const sorted = sortLeaderboardEntries(data);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      } catch (e) {}
      return sorted;
    }
  } catch (err) {
    // API not reachable or static host fallback
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return sortLeaderboardEntries(parsed);
    }
  } catch (e) {}

  return [];
}

/**
 * Synchronous getter returning local cached entries.
 */
export function getLeaderboardEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return sortLeaderboardEntries(parsed);
    }
  } catch (e) {}
  return [];
}

/**
 * Saves a completed attempt to backend API and updates local store.
 */
export async function saveLeaderboardEntry(attemptRecord) {
  const normalized = {
    attemptId: attemptRecord.attemptId || `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: (attemptRecord.name || '').trim(),
    club: attemptRecord.isRotaractor ? (attemptRecord.club || '').trim() : 'Participant',
    isRotaractor: !!attemptRecord.isRotaractor,
    correctAnswers: attemptRecord.correctAnswers || 0,
    totalQuestions: attemptRecord.totalQuestions || 15,
    incorrectAnswers: attemptRecord.incorrectAnswers || 0,
    unansweredQuestions: attemptRecord.unansweredQuestions || 0,
    totalScore: attemptRecord.totalScore || 0,
    score: attemptRecord.totalScore || 0,
    totalTimeSeconds: attemptRecord.totalTimeSeconds || 0,
    timeTakenSeconds: attemptRecord.totalTimeSeconds || 0,
    completedAt: attemptRecord.completedAt || new Date().toISOString(),
  };

  let updatedList = [];

  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    });
    if (res.ok) {
      updatedList = await res.json();
    }
  } catch (err) {
    // API offline fallback
  }

  if (updatedList.length === 0) {
    const current = getLeaderboardEntries();
    const exists = current.some((item) => item.attemptId === normalized.attemptId);
    if (!exists) {
      current.push(normalized);
    }
    updatedList = sortLeaderboardEntries(current);
  } else {
    updatedList = sortLeaderboardEntries(updatedList);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {}

  // Broadcast to other open tabs
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'LEADERBOARD_UPDATED', data: updatedList });
    } catch (e) {}
  }

  return updatedList;
}

/**
 * Calculate 1-based rank position of a completed attempt among all global entries.
 * Identical correct answers, score, AND time share the same rank.
 */
export function getParticipantRank(allEntries, targetAttemptId, currentAttemptData) {
  const sorted = sortLeaderboardEntries(allEntries);
  if (sorted.length === 0) return 1;

  // Compute ranks with tie handling
  let currentRank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const prev = sorted[i - 1];
      const curr = sorted[i];

      const prevCorrect = prev.correctAnswers !== undefined ? prev.correctAnswers : (prev.totalCorrect || 0);
      const currCorrect = curr.correctAnswers !== undefined ? curr.correctAnswers : (curr.totalCorrect || 0);

      const prevScore = prev.totalScore !== undefined ? prev.totalScore : (prev.score || 0);
      const currScore = curr.totalScore !== undefined ? curr.totalScore : (curr.score || 0);

      const prevTime = prev.totalTimeSeconds !== undefined ? prev.totalTimeSeconds : (prev.timeTakenSeconds || 0);
      const currTime = curr.totalTimeSeconds !== undefined ? curr.totalTimeSeconds : (curr.timeTakenSeconds || 0);

      // If NOT identical in correct, score, AND time, rank increases to current index + 1
      if (currCorrect !== prevCorrect || currScore !== prevScore || currTime !== prevTime) {
        currentRank = i + 1;
      }
    }

    if (sorted[i].attemptId === targetAttemptId) {
      return currentRank;
    }
  }

  // Fallback if target attempt is not found in sorted array yet
  if (currentAttemptData) {
    let rank = 1;
    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const itemCorrect = item.correctAnswers !== undefined ? item.correctAnswers : (item.totalCorrect || 0);
      const itemScore = item.totalScore !== undefined ? item.totalScore : (item.score || 0);
      const itemTime = item.totalTimeSeconds !== undefined ? item.totalTimeSeconds : (item.timeTakenSeconds || 0);

      if (
        currentAttemptData.correctAnswers < itemCorrect ||
        (currentAttemptData.correctAnswers === itemCorrect && currentAttemptData.totalScore < itemScore) ||
        (currentAttemptData.correctAnswers === itemCorrect && currentAttemptData.totalScore === itemScore && currentAttemptData.totalTimeSeconds > itemTime)
      ) {
        rank++;
      }
    }
    return rank;
  }

  return 1;
}

/**
 * Filter leaderboard entries by tab.
 */
export function filterLeaderboard(entries, filterTab, userClub = '') {
  if (!filterTab || filterTab === 'ALL') {
    return entries;
  }
  if (filterTab === 'ROTARACTORS') {
    return entries.filter((item) => item.isRotaractor);
  }
  if (filterTab === 'MY_CLUB') {
    if (!userClub || userClub.toLowerCase() === 'participant') {
      return entries.filter((item) => !item.isRotaractor);
    }
    const normUserClub = userClub.trim().toLowerCase();
    return entries.filter((item) => item.club.trim().toLowerCase() === normUserClub);
  }
  return entries;
}

/**
 * Subscribe to real-time tab updates via BroadcastChannel
 */
export function subscribeLeaderboardUpdates(callback) {
  if (!broadcastChannel) return () => {};

  const handler = (event) => {
    if (event.data && event.data.type === 'LEADERBOARD_UPDATED') {
      callback(event.data.data);
    }
  };

  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel.removeEventListener('message', handler);
  };
}
