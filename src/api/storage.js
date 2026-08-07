/**
 * Where the logged-in session lives.
 *
 * "Remember me" picks the storage area: localStorage survives closing the
 * browser, sessionStorage is wiped with the tab. Everything else in the app
 * reads through here so it never has to care which one is in use.
 */

export const TOKEN_KEY = 'basega_token'
export const USER_KEY  = 'basega_user'

const AREAS = () => [localStorage, sessionStorage]

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null   // corrupted entry — treat as logged out
  }
}

export function saveSession(token, user, remember) {
  clearSession()   // never leave a stale copy in the other area
  const area = remember ? localStorage : sessionStorage
  area.setItem(TOKEN_KEY, token)
  area.setItem(USER_KEY, JSON.stringify(user))
}

/** Refresh the cached user without disturbing the remember-me choice. */
export function saveUser(user) {
  const area = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage
  if (area.getItem(TOKEN_KEY)) area.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  for (const area of AREAS()) {
    area.removeItem(TOKEN_KEY)
    area.removeItem(USER_KEY)
  }
}
