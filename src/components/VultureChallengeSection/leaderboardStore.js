/**
 * PROJECT JATAYU 3.0 — SUPABASE GLOBAL LEADERBOARD STORE
 * Pure Supabase client sync, real-time postgres updates, and 3-tier competitive ranking logic.
 * NO client-side localStorage state for global leaderboard records.
 */
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js';

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
 * Sort leaderboard entries using exact competitive ranking logic:
 * 1. PRIMARY: correctAnswers (DESC)
 * 2. SECONDARY: totalTimeSeconds (ASC: lower is faster)
 * 3. TERTIARY: completedAt (ASC: earlier submission time)
 */
export function sortLeaderboardEntries(entries = []) {
  return [...entries].sort((a, b) => {
    // 1. Primary: Correct Answers (Higher is better)
    const correctA = a.correctAnswers !== undefined ? a.correctAnswers : (a.correct_answers || 0);
    const correctB = b.correctAnswers !== undefined ? b.correctAnswers : (b.correct_answers || 0);
    if (correctB !== correctA) {
      return correctB - correctA;
    }

    // 2. Secondary: Total Time Taken (Lower is better)
    const timeA = a.totalTimeSeconds !== undefined ? a.totalTimeSeconds : (a.time_seconds || 0);
    const timeB = b.totalTimeSeconds !== undefined ? b.totalTimeSeconds : (b.time_seconds || 0);
    if (timeA !== timeB) {
      return timeA - timeB;
    }

    // 3. Tertiary: Completion Timestamp (Earlier is better)
    const dateA = new Date(a.completedAt || a.completed_at || 0).getTime();
    const dateB = new Date(b.completedAt || b.completed_at || 0).getTime();
    return dateA - dateB;
  });
}

/**
 * Normalizes a raw Supabase database row to component data model
 */
export function normalizeSupabaseRow(row) {
  const isRotaractor = row.rotaract_club && row.rotaract_club.trim().toLowerCase() !== 'participant';
  return {
    id: row.id,
    attemptId: row.id,
    name: row.name || 'Anonymous',
    club: row.rotaract_club || 'Participant',
    isRotaractor,
    correctAnswers: row.correct_answers || 0,
    totalQuestions: row.total_questions || 15,
    totalScore: row.score || 0,
    score: row.score || 0,
    totalTimeSeconds: row.time_seconds || 0,
    timeTakenSeconds: row.time_seconds || 0,
    completedAt: row.completed_at || new Date().toISOString(),
  };
}

/**
 * Loads leaderboard entries directly from Supabase database table `quiz_attempts`.
 */
export async function fetchLeaderboardEntries() {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'SUPABASE_NOT_CONFIGURED',
      message: 'Supabase credentials are not configured in .env file.',
      data: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .order('correct_answers', { ascending: false })
      .order('time_seconds', { ascending: true })
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('Error fetching leaderboard from Supabase:', error);
      return {
        success: false,
        error: error.code || 'SUPABASE_FETCH_ERROR',
        message: error.message || 'Failed to fetch leaderboard from database.',
        data: [],
      };
    }

    const normalized = (data || []).map(normalizeSupabaseRow);
    const sorted = sortLeaderboardEntries(normalized);

    return {
      success: true,
      error: null,
      data: sorted,
    };
  } catch (err) {
    console.error('Unexpected error fetching Supabase leaderboard:', err);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
      message: err.message || 'An unexpected network error occurred.',
      data: [],
    };
  }
}

/**
 * Saves a completed quiz attempt directly to Supabase table `quiz_attempts`.
 */
export async function saveLeaderboardEntry(attemptRecord) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'SUPABASE_NOT_CONFIGURED',
      message: 'Supabase credentials are not configured in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  const payload = {
    name: (attemptRecord.name || '').trim(),
    rotaract_club: attemptRecord.isRotaractor ? (attemptRecord.club || '').trim() : 'Participant',
    correct_answers: Number(attemptRecord.correctAnswers) || 0,
    total_questions: Number(attemptRecord.totalQuestions) || 15,
    score: Number(attemptRecord.totalScore) || 0,
    time_seconds: Number(attemptRecord.totalTimeSeconds) || 0,
    completed_at: attemptRecord.completedAt || new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([payload])
      .select();

    if (error) {
      console.error('Error inserting quiz attempt to Supabase:', error);
      return {
        success: false,
        error: error.code || 'SUPABASE_INSERT_ERROR',
        message: error.message || 'Failed to save quiz result to Supabase.',
      };
    }

    // Refetch the complete updated leaderboard list from Supabase
    const refetchResult = await fetchLeaderboardEntries();
    const updatedEntries = refetchResult.data || [];
    const insertedRecord = data && data[0] ? normalizeSupabaseRow(data[0]) : null;

    return {
      success: true,
      error: null,
      insertedRecord,
      entries: updatedEntries,
    };
  } catch (err) {
    console.error('Unexpected error inserting quiz attempt to Supabase:', err);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
      message: err.message || 'Network error occurred while submitting result.',
    };
  }
}

/**
 * Calculate 1-based rank position of a completed attempt among all global entries.
 * Exact ordering rules: 1. correctAnswers DESC, 2. totalTimeSeconds ASC, 3. completedAt ASC
 */
export function getParticipantRank(allEntries, targetId, currentAttemptData) {
  const sorted = sortLeaderboardEntries(allEntries);
  if (sorted.length === 0) return 1;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].id === targetId || sorted[i].attemptId === targetId) {
      return i + 1;
    }
  }

  // Fallback rank calculation if item is not found yet
  if (currentAttemptData) {
    let rank = 1;
    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const itemCorrect = item.correctAnswers !== undefined ? item.correctAnswers : (item.correct_answers || 0);
      const itemTime = item.totalTimeSeconds !== undefined ? item.totalTimeSeconds : (item.time_seconds || 0);

      if (
        currentAttemptData.correctAnswers < itemCorrect ||
        (currentAttemptData.correctAnswers === itemCorrect && currentAttemptData.totalTimeSeconds > itemTime)
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
export function filterLeaderboard(entries = [], filterTab = 'ALL', userClub = '') {
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
 * Subscribe to real-time Postgres changes on `quiz_attempts` table via Supabase realtime channel
 */
export function subscribeLeaderboardUpdates(callback) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('public:quiz_attempts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quiz_attempts' },
        async () => {
          const res = await fetchLeaderboardEntries();
          if (res.success) {
            callback(res.data);
          }
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {}
    };
  } catch (e) {
    console.warn('Realtime subscription error:', e);
    return () => {};
  }
}
