/**
 * PROJECT JATAYU 3.0 — COOKIE PERSISTENCE UTILITIES
 * Helper functions for storing and retrieving user profile info in browser cookies.
 */

/**
 * Set a cookie with a name, value, and expiration in days (default 365 days)
 */
export function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  try {
    const maxAgeSeconds = days * 24 * 60 * 60;
    const encodedValue = encodeURIComponent(String(value || ''));
    document.cookie = `${name}=${encodedValue}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
  } catch (err) {
    console.warn('Failed to set cookie:', name, err);
  }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return '';
  try {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
  } catch (err) {
    console.warn('Failed to get cookie:', name, err);
  }
  return '';
}

/**
 * Remove a cookie by name
 */
export function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`;
  } catch (err) {
    console.warn('Failed to delete cookie:', name, err);
  }
}

/**
 * Save user registration profile to cookies
 */
export function saveUserProfileToCookies(name, club, isNotRotaractor) {
  setCookie('jatayu_user_name', name);
  setCookie('jatayu_user_club', isNotRotaractor ? 'Participant' : club);
  setCookie('jatayu_is_not_rotaractor', isNotRotaractor ? 'true' : 'false');
}

/**
 * Load user registration profile from cookies
 */
export function loadUserProfileFromCookies() {
  const name = getCookie('jatayu_user_name');
  const club = getCookie('jatayu_user_club');
  const isNotRotaractorRaw = getCookie('jatayu_is_not_rotaractor');
  const isNotRotaractor = isNotRotaractorRaw === 'true';

  return {
    name: name || '',
    club: isNotRotaractor ? 'Participant' : (club || ''),
    isNotRotaractor,
  };
}
