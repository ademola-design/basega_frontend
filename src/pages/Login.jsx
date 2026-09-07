import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/client'
import PasswordInput from '../components/PasswordInput'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user, ready } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Direct Identity Verification & Reset modal state
  const [showForgot, setShowForgot] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1 = Verify Identity, 2 = Enter New Password
  const [verifyData, setVerifyData] = useState({ email: '', classSet: '', phone: '' })
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  function openForgotModal() {
    setShowForgot(true)
    setForgotStep(1)
    setVerifyData({ email: '', classSet: '', phone: '' })
    setResetToken('')
    setNewPassword('')
    setConfirmNewPassword('')
    setForgotError('')
    setForgotSuccess('')
  }

  async function handleVerifyIdentity(e) {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    try {
      const res = await authAPI.verifyIdentity(verifyData)
      setResetToken(res.resetToken)
      setForgotStep(2)
    } catch (err) {
      setForgotError(err.message || 'Verification failed. Details do not match our records.')
    } finally {
      setForgotLoading(false)
    }
  }

  async function handleDirectReset(e) {
    e.preventDefault()
    setForgotError('')
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match.')
      return
    }

    setForgotLoading(true)
    try {
      await authAPI.resetPassword(resetToken, newPassword)
      setForgotSuccess('Password updated successfully! You can now log in.')
      setForm(f => ({ ...f, email: verifyData.email, password: newPassword }))
      setTimeout(() => {
        setShowForgot(false)
      }, 2000)
    } catch (err) {
      setForgotError(err.message || 'Failed to update password.')
    } finally {
      setForgotLoading(false)
    }
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.email) { setError('Please enter your email address.'); return }
    if (!form.password) { setError('Please enter your password.'); return }

    setLoading(true)
    try {
      // `remember` decides whether the session outlives the browser window.
      const loggedIn = await login(form.email, form.password, remember)

      // Send them back where they were headed, else the right home for their role.
      const from = location.state?.from
      if (from) navigate(from, { replace: true })
      else if (loggedIn.role === 'admin') navigate('/admin', { replace: true })
      else navigate('/dashboard', { replace: true })
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
              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className="login-options" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={openForgotModal}
                style={{ fontSize: '0.84rem', color: 'var(--green-700)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Forgot Password?
              </button>
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

          {/* On-Screen Direct Password Reset Modal */}
          {showForgot && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
              backdropFilter: 'blur(2px)'
            }}>
              <div style={{
                background: '#fff', borderRadius: '14px', padding: '28px', maxWidth: '440px', width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--green-900)', margin: 0, fontWeight: 700 }}>
                    {forgotStep === 1 ? 'Verify Your Identity' : 'Set New Password'}
                  </h3>
                  <button
                    onClick={() => setShowForgot(false)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--gray-400)', cursor: 'pointer', padding: '2px 6px' }}
                  >
                    ✕
                  </button>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--gray-600)', marginBottom: '18px', lineHeight: 1.5 }}>
                  {forgotStep === 1
                    ? 'Enter your registered email, class set, and phone number to verify your alumni account.'
                    : 'Your identity has been verified! You can now choose a new password for your account.'}
                </p>

                {forgotError && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '16px',
                    background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5'
                  }}>
                    {forgotError}
                  </div>
                )}

                {forgotSuccess && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '16px',
                    background: 'var(--green-50)', color: 'var(--green-800)', border: '1px solid var(--green-200)'
                  }}>
                    {forgotSuccess}
                  </div>
                )}

                {forgotStep === 1 ? (
                  <form onSubmit={handleVerifyIdentity}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '5px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={verifyData.email}
                        onChange={e => setVerifyData(d => ({ ...d, email: e.target.value }))}
                        placeholder="your@email.com"
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)',
                          fontSize: '0.88rem', outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '5px' }}>
                        Class Set (Graduation Year)
                      </label>
                      <input
                        type="number"
                        required
                        min="1970"
                        max="2030"
                        value={verifyData.classSet}
                        onChange={e => setVerifyData(d => ({ ...d, classSet: e.target.value }))}
                        placeholder="e.g. 1998"
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)',
                          fontSize: '0.88rem', outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '5px' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={verifyData.phone}
                        onChange={e => setVerifyData(d => ({ ...d, phone: e.target.value }))}
                        placeholder="e.g. 08012345678"
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)',
                          fontSize: '0.88rem', outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => setShowForgot(false)}
                        className="btn btn-outline btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="btn btn-primary btn-sm"
                      >
                        {forgotLoading ? 'Verifying…' : 'Verify & Continue →'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleDirectReset}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '5px' }}>
                        New Password
                      </label>
                      <PasswordInput
                        name="newPassword"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '5px' }}>
                        Confirm New Password
                      </label>
                      <PasswordInput
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => setShowForgot(false)}
                        className="btn btn-outline btn-sm"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="btn btn-primary btn-sm"
                      >
                        {forgotLoading ? 'Updating…' : 'Save New Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

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
