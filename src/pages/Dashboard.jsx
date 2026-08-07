import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'

const QUICK_LINKS = [
  { to: '/payment',  label: 'Pay Annual Dues',     desc: '2026 dues: ₦25,000' },
  { to: '/members',  label: 'Members Directory',    desc: 'Find fellow alumni' },
  { to: '/events',   label: 'Events',               desc: 'Upcoming activities' },
  { to: '/news',     label: 'Announcements',        desc: 'Latest updates' },
  { to: '/jubilee',  label: 'Jubilee 50th',         desc: 'Anniversary updates' },
  { to: '/contact',  label: 'Contact Secretariat',  desc: 'Get in touch' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ProtectedRoute has already confirmed the session, so this only needs to
  // load the fuller profile. An expired token surfaces as a 401, which
  // AuthContext handles globally.
  useEffect(() => {
    authAPI.me()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="db-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="login-spinner" style={{ width: 40, height: 40 }} />
      </div>
    )
  }

  const displayName = profile
    ? `${profile.title ? profile.title + ' ' : ''}${profile.first_name} ${profile.last_name}`
    : user?.email || 'Member'

  const memberStatus = profile?.status || 'pending'
  const duesPaid     = profile?.duesPaidThisYear || false
  const classSet     = profile?.class_set ? `Set of ${profile.class_set}` : 'BASEGA Graduate'

  return (
    <div className="db-page">

      {/* ── Top bar ── */}
      <div className="db-topbar">
        <div className="container db-topbar-inner">
          <div className="db-topbar-brand">
            <img src="/basega-crest.png" alt="BASEGA" className="db-topbar-crest" />
            <span>Member Portal</span>
          </div>
          <div className="db-topbar-actions">
            <Link to="/" className="db-topbar-link">← Public Site</Link>
            <button className="db-logout-btn" onClick={() => logout()}>Logout</button>
          </div>
        </div>
      </div>

      {/* ── Welcome banner ── */}
      <div className="db-banner">
        <div className="container">
          <div className="db-banner-inner">
            <Avatar
              photoUrl={profile?.photo_url || user?.photoUrl}
              name={displayName}
              className="db-avatar"
            />
            <div>
              <p className="db-welcome-label">Welcome back,</p>
              <h1 className="db-welcome-name">{displayName}</h1>
              <p className="db-welcome-email">{profile?.email || user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container db-body">

        {/* ── Pending approval notice ── */}
        {memberStatus === 'pending' && (
          <div className="db-notice" style={{ borderColor: '#f59e0b', background: '#fffbeb' }}>
            <span className="db-notice-icon">⏳</span>
            <div>
              <strong>Membership Pending</strong>
              <p>Your application is under review by the admin team. You will receive an email once approved (3–5 working days).</p>
            </div>
          </div>
        )}

        {/* ── Status cards ── */}
        <div className="db-status-row">
          <div className="db-status-card">
            <div className={`db-status-dot ${duesPaid ? 'active-dot' : 'pending-dot'}`} />
            <div>
              <div className="db-status-label">Dues Status</div>
              <div className={`db-status-value ${duesPaid ? '' : 'pending'}`}>
                {duesPaid ? 'Paid — 2026' : 'Pending — 2026'}
              </div>
            </div>
            {!duesPaid && (
              <Link to="/payment" className="db-status-cta">Pay Now →</Link>
            )}
          </div>
          <div className="db-status-card">
            <div className={`db-status-dot ${memberStatus === 'financial' || memberStatus === 'approved' ? 'active-dot' : 'neutral-dot'}`} />
            <div>
              <div className="db-status-label">Membership</div>
              <div className="db-status-value" style={{ textTransform: 'capitalize' }}>
                {memberStatus === 'financial' ? 'Financial Member' :
                 memberStatus === 'approved'  ? 'Registered Member' :
                 memberStatus === 'pending'   ? 'Pending Approval' : memberStatus}
              </div>
            </div>
          </div>
          <div className="db-status-card">
            <div className="db-status-dot neutral-dot" />
            <div>
              <div className="db-status-label">Alumni Since</div>
              <div className="db-status-value">{classSet}</div>
            </div>
          </div>
        </div>

        {/* ── Quick links ── */}
        <div className="db-section-head">
          <h2>Quick Access</h2>
        </div>
        <div className="db-links-grid">
          {QUICK_LINKS.map(l => (
            <Link key={l.to} to={l.to} className="db-link-card">
              <div className="db-link-label">{l.label}</div>
              <div className="db-link-desc">{l.desc}</div>
            </Link>
          ))}
        </div>

        {/* ── Notice ── */}
        <div className="db-notice">
          <span className="db-notice-icon"></span>
          <div>
            <strong>50th Founders' Day — Jubilee Anniversary</strong>
            <p>BASEGA is celebrating 50 years of excellence. Visit the Jubilee page for updates and how to participate.</p>
          </div>
          <Link to="/jubilee" className="db-notice-btn">View Updates →</Link>
        </div>

      </div>
    </div>
  )
}
