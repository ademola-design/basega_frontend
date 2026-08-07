import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user, ready } = useAuth()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.email)    { setError('Please enter your email address.'); return }
    if (!form.password) { setError('Please enter your password.'); return }

    setLoading(true)
    try {
      // `remember` decides whether the session outlives the browser window.
      const loggedIn = await login(form.email, form.password, remember)

      // Send them back where they were headed, else the right home for their role.
      const from = location.state?.from
      if (from)                          navigate(from, { replace: true })
      else if (loggedIn.role === 'admin') navigate('/admin', { replace: true })
      else                                navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Already signed in — no reason to show the form again.
  if (ready && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-inner">
          <img src="/basega-crest.png" alt="BASEGA" className="login-side-crest" />
          <h2>BASEGA Alumni<br />Association</h2>
          <p>Connecting graduates across Nigeria and the diaspora. Sign in to access your member portal, pay dues, and stay connected.</p>
          <div className="login-side-stats">
            <div><strong>5,240+</strong><span>Registered Alumni</span></div>
            <div><strong>1,850</strong><span>Financial Members</span></div>
            <div><strong>50 Yrs</strong><span>Est. 1976</span></div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-logo">
            <img src="/basega-crest.png" alt="BASEGA Crest" />
          </div>
          <h1 className="login-heading">Welcome Back</h1>
          <p className="login-sub">Sign in to your member account</p>

          <form onSubmit={submit} className="login-form" noValidate>
            {error && (
              <div className="login-error">{error}</div>
            )}

            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-pw-wrap">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handle}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPw(s => !s)}
                  tabIndex={-1}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className={`login-submit-btn${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              {loading ? <span className="login-spinner" /> : null}
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="login-divider"><span>New to BASEGA?</span></div>

          <Link to="/register" className="login-register-btn">
            Create an Account
          </Link>

          <p className="login-back">
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
