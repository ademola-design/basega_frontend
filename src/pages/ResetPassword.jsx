import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/client'
import PasswordInput from '../components/PasswordInput'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-inner">
          <img src="/basega-crest.png" alt="BASEGA" className="login-side-crest" />
          <h2>BASEGA Alumni<br />Association</h2>
          <p>Account Security & Password Management</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-box-header">
            <h2>Set New Password</h2>
            <p>Please choose a new, strong password for your account.</p>
          </div>

          {error && <div className="login-error-alert">{error}</div>}

          {success ? (
            <div style={{
              background: 'var(--green-50)', border: '1px solid var(--green-200)',
              color: 'var(--green-800)', padding: '20px', borderRadius: '8px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✓</div>
              <h4 style={{ marginBottom: '8px', fontWeight: 700 }}>Password Reset Successfully!</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                Your password has been updated. Redirecting to login in a few moments...
              </p>
              <Link to="/login" className="btn btn-primary btn-sm">
                Go to Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="password">New Password</label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>

              <div className="login-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className={`login-submit-btn${loading ? ' loading' : ''}`}
                disabled={loading}
              >
                {loading ? <span className="login-spinner" /> : null}
                {loading ? 'Updating Password…' : 'Update Password →'}
              </button>
            </form>
          )}

          <p className="login-back" style={{ marginTop: '24px' }}>
            <Link to="/login">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
