import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { imageUrl } from '../api/client'

const links = [
  { to: '/',                 label: 'Home' },
  { to: '/about',            label: 'About' },
  { to: '/payment',          label: 'Payments' },
  { to: '/members',          label: 'Members' },
  { to: '/news',             label: 'Announcements' },
  { to: '/alumni-of-month',  label: 'Alumni of the Month' },
  { to: '/jubilee',          label: 'Jubilee', line2: '50th', highlight: true },
]

function initials(user) {
  const first = user.firstName?.[0] || user.email?.[0] || 'M'
  const last  = user.lastName?.[0]  || ''
  return (first + last).toUpperCase()
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close the menus on navigation so they don't hang open over the new page.
  useEffect(() => { setMenuOpen(false); setOpen(false) }, [pathname])

  // Click-outside and Escape both dismiss the account dropdown.
  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const photo = user?.photoUrl ? imageUrl(user.photoUrl) : null

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <div className="navbar-logo">
            <img src="/basega-crest.png" alt="BASEGA Crest" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} />
          </div>
          <div className="navbar-brand-text">
            <div className="brand-name">BASEGA</div>
            <div className="brand-sub">Alumni Association</div>
          </div>
        </Link>

        <div className="navbar-nav">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${pathname === l.to ? 'active' : ''}${l.highlight ? ' nav-link-jubilee' : ''}`}
            >
              {l.line2 ? <>{l.label}<br />{l.line2}</> : l.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="nav-account" ref={menuRef}>
              <button
                type="button"
                className="nav-account-btn"
                onClick={() => setMenuOpen(o => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="nav-avatar">
                  {photo
                    ? <img src={photo} alt="" />
                    : initials(user)}
                </span>
                <span className="nav-account-name">{user.firstName || 'Account'}</span>
                <span className={`nav-caret ${menuOpen ? 'up' : ''}`} aria-hidden="true" />
              </button>

              {menuOpen && (
                <div className="nav-dropdown" role="menu">
                  <div className="nav-dropdown-head">
                    <div className="nav-dropdown-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="nav-dropdown-email">{user.email}</div>
                    {user.status === 'pending' && (
                      <span className="nav-dropdown-badge">Awaiting approval</span>
                    )}
                  </div>

                  <Link to="/dashboard" className="nav-dropdown-item" role="menuitem">
                    My Dashboard
                  </Link>
                  <Link to={`/members/${user.id}`} className="nav-dropdown-item" role="menuitem">
                    My Profile
                  </Link>
                  <Link to="/payment" className="nav-dropdown-item" role="menuitem">
                    Pay Dues
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-dropdown-item" role="menuitem">
                      Admin Panel
                    </Link>
                  )}

                  <div className="nav-dropdown-sep" />
                  <button
                    type="button"
                    className="nav-dropdown-item nav-dropdown-logout"
                    onClick={() => logout()}
                    role="menuitem"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"    className="nav-btn-login">Login</Link>
              <Link to="/register" className="nav-btn-register">Register</Link>
            </>
          )}
          <Link to="/payment"  className="nav-btn-gold">Pay Dues</Link>
        </div>

        <button
          className="navbar-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar-mobile ${open ? 'open' : ''}`}>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link ${pathname === l.to ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}

        {user ? (
          <>
            <div className="nav-mobile-sep" />
            <div className="nav-mobile-user">
              <span className="nav-avatar">
                {photo ? <img src={photo} alt="" /> : initials(user)}
              </span>
              <div>
                <div className="nav-mobile-user-name">{user.firstName} {user.lastName}</div>
                <div className="nav-mobile-user-email">{user.email}</div>
              </div>
            </div>
            <Link to="/dashboard" className="nav-link" onClick={() => setOpen(false)}>My Dashboard</Link>
            <Link to={`/members/${user.id}`} className="nav-link" onClick={() => setOpen(false)}>My Profile</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link" onClick={() => setOpen(false)}>Admin Panel</Link>
            )}
            <Link to="/payment" className="nav-link" onClick={() => setOpen(false)}>Pay Dues</Link>
            <button
              type="button"
              className="nav-link nav-mobile-logout"
              onClick={() => { setOpen(false); logout() }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="nav-link" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" className="nav-link" onClick={() => setOpen(false)}>Register</Link>
            <Link to="/payment"  className="nav-link" onClick={() => setOpen(false)}>Pay Dues</Link>
          </>
        )}
      </div>
    </nav>
  )
}
