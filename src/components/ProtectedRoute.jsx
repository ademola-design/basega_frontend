import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Gate for member-only and admin-only pages.
 *
 * The check happens before the page renders, so protected content never
 * flashes on screen for a signed-out visitor. Where the user was headed is
 * kept in location state so Login can send them back after signing in.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  // Still confirming the stored token — don't decide yet, or a valid
  // session would be bounced to /login on every refresh.
  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="login-spinner" style={{ width: 40, height: 40 }} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
