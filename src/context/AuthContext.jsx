import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/client'
import { getToken, getUser, saveSession, saveUser, clearSession, TOKEN_KEY } from '../api/storage'

/**
 * Single source of truth for who is signed in.
 *
 * Pages must not read the token or user out of storage themselves — they get
 * both from useAuth(), so the navbar, the dashboard and the route guards can
 * never disagree about the session.
 */
const AuthContext = createContext(null)

/** /api/auth/me returns DB columns; login returns camelCase. Normalise to one shape. */
function normalise(profile) {
  return {
    id:        profile.id,
    firstName: profile.first_name ?? profile.firstName,
    lastName:  profile.last_name  ?? profile.lastName,
    email:     profile.email,
    role:      profile.role,
    status:    profile.status,
    photoUrl:  profile.photo_url  ?? profile.photoUrl ?? null,
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  // Seed from storage so a page refresh doesn't flash the logged-out navbar
  // before the /me call comes back.
  const [user, setUser]   = useState(getUser)
  const [ready, setReady] = useState(false)

  // Confirm the stored token is still good and refresh the cached user.
  useEffect(() => {
    if (!getToken()) { setReady(true); return }

    let cancelled = false
    authAPI.me()
      .then(profile => {
        if (cancelled) return
        const fresh = normalise(profile)
        setUser(fresh)
        saveUser(fresh)
      })
      .catch(() => {
        // Expired or revoked token — drop it rather than leaving a session
        // that looks alive in the navbar but fails on every request.
        if (cancelled) return
        clearSession()
        setUser(null)
      })
      .finally(() => { if (!cancelled) setReady(true) })

    return () => { cancelled = true }
  }, [])

  // A 401 anywhere in the app means the session is gone. client.js fires this.
  // Only drop the user here — don't redirect. ProtectedRoute sends them to
  // /login if they're on a members-only page; someone reading a public page
  // just sees the navbar quietly revert instead of being hauled off it.
  useEffect(() => {
    function onUnauthorized() { setUser(null) }
    window.addEventListener('basega:unauthorized', onUnauthorized)
    return () => window.removeEventListener('basega:unauthorized', onUnauthorized)
  }, [])

  // Logging out in one tab logs out the others. Only fires for localStorage,
  // which is correct: a sessionStorage login is deliberately tab-local.
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== null && e.key !== TOKEN_KEY) return
      setUser(getToken() ? getUser() : null)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = useCallback(async (email, password, remember = false) => {
    const data = await authAPI.login(email, password)
    saveSession(data.token, data.user, remember)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback((redirectTo = '/') => {
    clearSession()
    setUser(null)
    navigate(redirectTo, { replace: true })
  }, [navigate])

  const value = {
    user,
    ready,
    login,
    logout,
    isLoggedIn: !!user,
    isAdmin:    user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
