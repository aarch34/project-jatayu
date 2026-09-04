/**
 * PROJECT JATAYU 3.0 — PERSISTENT LEADERBOARD STORE
 * Manages participant scores, filters, and tie-breaking algorithms.
 */

const STORAGE_KEY = 'jatayu_vulture_challenge_leaderboard_v1';

// No fake static baseline entries — leaderboard is populated purely by actual user completions
const INITIAL_ENTRIES = [];

/**
 * Compare two leaderboard entries according to strict tie-breaking rules:
 * 1. Total score (descending)
 * 2. Level 3 correct count (descending)
 * 3. Level 2 correct count (descending)
 * 4. Level 1 correct count (descending)
 * 5. Completion time in seconds (ascending: faster is better)
 */
function sortEntries(entries) {
  // Filter out any lingering mock entries starting with entry_init_
  const realEntries = entries.filter((item) => !item.id || !item.id.startsWith('entry_init_'));

  return [...realEntries].sort((a, b) => {
    // 1. Total Score
    if (b.score !== a.score) return b.score - a.score;

    // 2. Level 3 Correct Answers
    const l3_a = a.levelBreakdown?.[3]?.correct || 0;
    const l3_b = b.levelBreakdown?.[3]?.correct || 0;
    if (l3_b !== l3_a) return l3_b - l3_a;

    // 3. Level 2 Correct Answers
    const l2_a = a.levelBreakdown?.[2]?.correct || 0;
    const l2_b = b.levelBreakdown?.[2]?.correct || 0;
    if (l2_b !== l2_a) return l2_b - l2_a;

    // 4. Level 1 Correct Answers
    const l1_a = a.levelBreakdown?.[1]?.correct || 0;
    const l1_b = b.levelBreakdown?.[1]?.correct || 0;
    if (l1_b !== l1_a) return l1_b - l1_a;

    // 5. Faster Completion Time
    const timeA = a.timeTakenSeconds || 999;
    const timeB = b.timeTakenSeconds || 999;
    return timeA - timeB;
  });
}

/**
 * Loads leaderboard entries from browser localStorage or returns empty list.
 */
export function getLeaderboardEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    const cleaned = sortEntries(parsed);
    // Write back cleaned array to remove any lingering mock items from browser storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch (err) {
    console.error('Failed to read leaderboard from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new completion result into the leaderboard with anti-duplicate logic.
 */
export function saveLeaderboardEntry(entryData) {
  const currentEntries = getLeaderboardEntries();
  const normalizedName = (entryData.name || '').trim().toLowerCase();
  const normalizedClub = (entryData.club || '').trim().toLowerCase();

  // Check if participant with exact same name and club already exists
  const existingIdx = currentEntries.findIndex(
    (item) => item.name.trim().toLowerCase() === normalizedName && item.club.trim().toLowerCase() === normalizedClub
  );

  let updatedEntries = [...currentEntries];

  if (existingIdx !== -1) {
    const existing = currentEntries[existingIdx];
    // If new score is higher OR equal score with faster time, update the existing entry
    if (
      entryData.score > existing.score ||
      (entryData.score === existing.score && entryData.timeTakenSeconds < existing.timeTakenSeconds)
    ) {
      updatedEntries[existingIdx] = {
        ...existing,
        ...entryData,
        id: existing.id,
        completedAt: entryData.completedAt || new Date().toISOString(),
      };
    }
  } else {
    // New entry
    const newRecord = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: entryData.name.trim(),
      club: entryData.isRotaractor ? entryData.club.trim() : 'Participant',
      isRotaractor: !!entryData.isRotaractor,
      score: entryData.score,
      totalCorrect: entryData.totalCorrect,
      levelBreakdown: entryData.levelBreakdown,
      timeTakenSeconds: entryData.timeTakenSeconds,
      completedAt: entryData.completedAt || new Date().toISOString(),
    };
    updatedEntries.push(newRecord);
  }

  const sorted = sortEntries(updatedEntries);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (e) {
    console.error('Failed to save leaderboard to localStorage:', e);
  }
  return sorted;
}

/**
 * Filters leaderboard entries based on active tab selection.
 * @param {Array} entries 
 * @param {string} filterTab - 'ALL' | 'ROTARACTORS' | 'MY_CLUB'
 * @param {string} userClub - Active user's club name
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
