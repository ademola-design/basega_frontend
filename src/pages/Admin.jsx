import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authAPI, membersAPI, newsAPI, eventsAPI, nominationsAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import { honoree } from '../lib/honoree'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'members', label: 'Members', icon: '👥' },
  { key: 'approvals', label: 'Pending Approvals', icon: '⏳' },
  { key: 'nominations', label: 'Nominations', icon: '🏆' },
  { key: 'news', label: 'News & Posts', icon: '📰' },
  { key: 'events', label: 'Events', icon: '📅' },
  { key: 'messages', label: 'Messages', icon: '💬' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

function initials(name) {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Admin() {
  const { logout } = useAuth()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [stats, setStats] = useState({ total: 0, pending: 0, financial: 0, newsCount: 0, evCount: 0, activity: [] })
  const [pendingList, setPendingList] = useState([])
  const [membersList, setMembersList] = useState([])
  const [newsList, setNewsList] = useState([])
  const [eventsList, setEventsList] = useState([])
  const [nominationsList, setNominationsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordState, setPasswordState] = useState({ saving: false, message: '', error: '' })

  // Modals state
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [newsFormData, setNewsFormData] = useState({ title: '', excerpt: '', category: 'General', body: '', imageUrl: '' })

  async function handleCreateNews(e) {
    e.preventDefault()
    try {
      await newsAPI.create(newsFormData)
      setShowNewsModal(false)
      setNewsFormData({ title: '', excerpt: '', category: 'General', body: '', imageUrl: '' })
      const updatedNews = await newsAPI.adminAll()
      setNewsList(updatedNews)
    } catch (err) {
      alert(err.message || 'Failed to create article')
    }
  }

  function setPasswordField(event) {
    const { name, value } = event.target
    setPasswordForm(current => ({ ...current, [name]: value }))
  }

  async function changeAdminPassword(event) {
    event.preventDefault()
    setPasswordState({ saving: false, message: '', error: '' })

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordState({ saving: false, message: '', error: 'New passwords do not match.' })
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordState({ saving: false, message: '', error: 'New password must be at least 6 characters.' })
      return
    }

    setPasswordState({ saving: true, message: '', error: '' })
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordState({ saving: false, message: 'Admin password updated successfully.', error: '' })
    } catch (error) {
      setPasswordState({ saving: false, message: '', error: error.message || 'Unable to update the admin password.' })
    }
  }

  async function deleteNews(id) {
    if (!window.confirm('Delete this article?')) return
    try {
      await newsAPI.remove(id)
      setNewsList(list => list.filter(n => n.id !== id))
    } catch (err) {
      alert(err.message || 'Failed to delete article')
    }
  }

  // Only one honoree per month. Warn before displacing the current holder,
  // because the swap is what the public pages will show immediately.
  async function selectNomination(nom, displayName) {
    const holder = nominationsList.find(
      n => n.status === 'selected' && n.month_year === nom.month_year && n.id !== nom.id
    )
    if (holder) {
      const holderName = honoree(holder).name
      const ok = window.confirm(
        `${holderName} is currently Alumni of the Month for ${nom.month_year}.\n\n` +
        `Making ${displayName} the honoree will return ${holderName} to pending. Continue?`
      )
      if (!ok) return
    }

    try {
      await nominationsAPI.select(nom.id)
      const data = await nominationsAPI.all()
      setNominationsList(data)
    } catch (err) {
      alert(err.message || 'Failed to approve nomination')
    }
  }

  async function rejectNomination(id) {
    try {
      await nominationsAPI.reject(id)
      const data = await nominationsAPI.all()
      setNominationsList(data)
    } catch (err) {
      alert(err.message || 'Failed to reject nomination')
    }
  }

  async function deleteNomination(id) {
    if (!window.confirm('Delete this nomination?')) return
    try {
      await nominationsAPI.remove(id)
      setNominationsList(list => list.filter(n => n.id !== id))
    } catch (err) {
      alert(err.message || 'Failed to delete nomination')
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  async function fetchAdminData() {
    setLoading(true)
    try {
      const [statsData, pendingData, allData, newsData, eventsData, nomsData] = await Promise.all([
        membersAPI.stats(),
        membersAPI.pending(),
        membersAPI.all(),
        newsAPI.adminAll(),
        eventsAPI.list(),
        nominationsAPI.all()
      ])
      setStats(statsData)
      setPendingList(pendingData)
      setMembersList(allData)
      setNewsList(newsData)
      setEventsList(eventsData)
      setNominationsList(nomsData)
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function approveUser(id) {
    try {
      await membersAPI.approve(id)
      setPendingList(list => list.filter(m => m.id !== id))
      const updatedStats = await membersAPI.stats()
      const updatedAll = await membersAPI.all()
      setStats(updatedStats)
      setMembersList(updatedAll)
    } catch (err) {
      alert(err.message || 'Failed to approve user.')
    }
  }

  async function rejectUser(id) {
    try {
      await membersAPI.reject(id)
      setPendingList(list => list.filter(m => m.id !== id))
      const updatedStats = await membersAPI.stats()
      setStats(updatedStats)
    } catch (err) {
      alert(err.message || 'Failed to reject user.')
    }
  }

  async function removeUser(id) {
    if (!window.confirm('Are you sure you want to remove this member?')) return
    try {
      await membersAPI.remove(id)
      setMembersList(list => list.filter(m => m.id !== id))
      const updatedStats = await membersAPI.stats()
      setStats(updatedStats)
    } catch (err) {
      alert(err.message || 'Failed to remove user.')
    }
  }

  async function handleSearch(e) {
    const query = e.target.value
    setSearchQuery(query)
    try {
      const params = {}
      if (query) params.search = query
      if (searchStatus) params.status = searchStatus
      const data = await membersAPI.all(params)
      setMembersList(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleStatusFilter(status) {
    setSearchStatus(status)
    try {
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (status) params.status = status
      const data = await membersAPI.all(params)
      setMembersList(data)
    } catch (err) {
      console.error(err)
    }
  }

  function handleLogout() {
    logout('/login')
  }

  const pageTitles = {
    dashboard: 'Dashboard',
    members: 'Members Management',
    approvals: 'Pending Approvals',
    nominations: 'Alumni Nominations',
    news: 'News & Posts',
    events: 'Events Management',
    messages: 'Messages',
    settings: 'Settings',
  }

  return (
    <div className="page-layout" style={{ background: 'var(--gray-100)' }}>
      <div className="admin-wrapper">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-top">
            <div style={{ color: 'var(--white)', fontWeight: 800, fontSize: '1.1rem' }}>BASEGA</div>
            <h3>Admin Panel</h3>
            <span>v1.0 · 2025</span>
          </div>
          <nav className="admin-nav">
            <div className="admin-nav-section">Main</div>
            {navItems.slice(0, 3).map(item => (
              <div
                key={item.key}
                className={`admin-nav-link ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => setActiveNav(item.key)}
              >
                <span>{item.icon}</span>
                {item.label}
                {item.key === 'approvals' && pendingList.length > 0 && (
                  <span style={{ marginLeft: 'auto', background: '#DC3545', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {pendingList.length}
                  </span>
                )}
              </div>
            ))}
            <div className="admin-nav-section">Manage</div>
            {navItems.slice(3, 7).map(item => (
              <div
                key={item.key}
                className={`admin-nav-link ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => setActiveNav(item.key)}
              >
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
            <div className="admin-nav-section">System</div>
            <div className={`admin-nav-link ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => setActiveNav('settings')}>
              <span>⚙️</span> Settings
            </div>
            <div className="admin-nav-link">
              <Link to="/upload-images" style={{ color: 'inherit', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>🖼️</span> Image Manager
              </Link>
            </div>
            <div className="admin-nav-link" style={{ marginTop: 'auto' }}>
              <Link to="/" style={{ color: 'inherit', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>🌐</span> View Website
              </Link>
            </div>
            <div className="admin-nav-link" onClick={handleLogout} style={{ color: '#ff4d4d', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span>🚪</span> Log Out
            </div>
          </nav>
        </aside>

        {/* Main */}
        <div className="admin-main">
          <div className="admin-topbar">
            <h2>{pageTitles[activeNav]}</h2>
            <div className="admin-topbar-right">
              <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Today: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <div className="admin-user-chip">
                <div className="ava">AD</div>
                <span>Admin User</span>
              </div>
            </div>
          </div>

          <div className="admin-body">
            {/* ===== DASHBOARD ===== */}
            {activeNav === 'dashboard' && (
              <>
                <div className="admin-stats-row">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon asi-green">👥</div>
                    <div className="admin-stat-info">
                      <div className="a-num">{stats.total}</div>
                      <div className="a-lbl">Total Members</div>
                      <div className="a-change up">Approved database entries</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon asi-yellow">⏳</div>
                    <div className="admin-stat-info">
                      <div className="a-num">{stats.pending}</div>
                      <div className="a-lbl">Pending Approvals</div>
                      <div className="a-change down">Awaiting admin review</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon asi-blue">📰</div>
                    <div className="admin-stat-info">
                      <div className="a-num">{stats.newsCount}</div>
                      <div className="a-lbl">Published Articles</div>
                      <div className="a-change up">Announcements & blog updates</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon asi-red">📅</div>
                    <div className="admin-stat-info">
                      <div className="a-num">{stats.evCount}</div>
                      <div className="a-lbl">Upcoming Events</div>
                      <div className="a-change up">Scheduled calendar events</div>
                    </div>
                  </div>
                </div>

                <div className="admin-grid-2">
                  {/* Recent Activity */}
                  <div className="admin-card">
                    <div className="admin-card-hdr">
                      <h3>Recent Activity</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>System logs</span>
                    </div>
                    <div className="admin-card-body">
                      {stats.activity && stats.activity.map((a, i) => {
                        const actionLower = a.action.toLowerCase()
                        let dot = 'blue'
                        if (actionLower.includes('approve') || actionLower.includes('confirm') || actionLower.includes('success')) dot = 'green'
                        else if (actionLower.includes('reject') || actionLower.includes('fail') || actionLower.includes('delete')) dot = 'red'
                        else if (actionLower.includes('request') || actionLower.includes('submit') || actionLower.includes('pending')) dot = 'yellow'

                        return (
                          <div key={i} className="activity-item">
                            <div className={`activity-dot ${dot}`} />
                            <div className="activity-text">
                              <strong>{a.first_name ? `${a.first_name} ${a.last_name}` : 'System'}</strong>: {a.action}
                            </div>
                            <div className="activity-time" style={{ fontSize: '0.78rem', opacity: 0.7 }}>
                              {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        )
                      })}
                      {(!stats.activity || stats.activity.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>No recent activity logs.</div>
                      )}
                    </div>
                  </div>

                  {/* Quick Approvals */}
                  <div className="admin-card">
                    <div className="admin-card-hdr">
                      <h3>Pending Approvals</h3>
                      <button className="btn btn-primary btn-xs" onClick={() => setActiveNav('approvals')}>View All</button>
                    </div>
                    <div className="admin-card-body">
                      <table className="a-table">
                        <thead>
                          <tr><th>Member</th><th>Year</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                          {pendingList.slice(0, 4).map(m => {
                            const name = `${m.first_name} ${m.last_name}`
                            return (
                              <tr key={m.id}>
                                <td>
                                  <div className="user-cell">
                                    <div className="user-ava-sm">{initials(name)}</div>
                                    <div>
                                      <div className="user-name-sm">{name}</div>
                                      <div className="user-email-sm">{m.profession || 'Alumnus'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>{m.class_set || '—'}</td>
                                <td>
                                  <div className="a-actions">
                                    <button className="btn btn-success btn-xs" onClick={() => approveUser(m.id)}>✓</button>
                                    <button className="btn btn-danger btn-xs" onClick={() => rejectUser(m.id)}>✗</button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                          {pendingList.length === 0 && (
                            <tr><td colSpan={3} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>All approvals cleared ✓</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== MEMBERS ===== */}
            {activeNav === 'members' && (
              <div className="admin-card">
                <div className="admin-card-hdr">
                  <h3>All Members ({membersList.length})</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Search name/profession/email…"
                      value={searchQuery}
                      onChange={handleSearch}
                      style={{ padding: '6px 12px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}
                    />
                    <select
                      value={searchStatus}
                      onChange={(e) => handleStatusFilter(e.target.value)}
                      style={{ padding: '6px 12px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', fontSize: '0.85rem', background: '#fff' }}
                    >
                      <option value="">All Statuses</option>
                      <option value="approved">Approved</option>
                      {/* <option value="financial">Financial</option> */}
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="admin-card-body" style={{ overflowX: 'auto' }}>
                  <table className="a-table">
                    <thead>
                      <tr><th>Member</th><th>Class Year</th><th>Profession</th><th>Location</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {membersList.map(m => {
                        const name = `${m.first_name} ${m.last_name}`
                        let badgeClass = 'badge badge-green'
                        let badgeText = m.status || 'Approved'
                        let customStyle = {}
                        if (m.status === 'financial') {
                          badgeText = 'Financial'
                          customStyle = { background: '#0D6EFD', color: '#fff' }
                        } else if (m.status === 'pending') {
                          badgeText = 'Pending'
                          customStyle = { background: '#FFC107', color: '#000' }
                        } else if (m.status === 'rejected') {
                          badgeText = 'Rejected'
                          customStyle = { background: '#DC3545', color: '#fff' }
                        }

                        return (
                          <tr key={m.id}>
                            <td>
                              <div className="user-cell">
                                <div className="user-ava-sm">{initials(name)}</div>
                                <div>
                                  <div className="user-name-sm">{name}</div>
                                  <div className="user-email-sm">{m.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{m.class_set || '—'}</td>
                            <td>{m.profession || '—'}</td>
                            <td>{m.city && m.state ? `${m.city}, ${m.state}` : '—'}</td>
                            <td><span className={badgeClass} style={customStyle}>{badgeText}</span></td>
                            <td>
                              <div className="a-actions">
                                <Link to={`/members/${m.id}`} className="btn btn-outline btn-xs">View</Link>
                                <button className="btn btn-danger btn-xs" onClick={() => removeUser(m.id)}>Remove</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {membersList.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>No members found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== PENDING APPROVALS ===== */}
            {activeNav === 'approvals' && (
              <div className="admin-card">
                <div className="admin-card-hdr">
                  <h3>Pending Membership Requests ({pendingList.length})</h3>
                </div>
                <div className="admin-card-body" style={{ overflowX: 'auto' }}>
                  <table className="a-table">
                    <thead>
                      <tr><th>Applicant</th><th>Email</th><th>Class Year</th><th>Profession</th><th>Submitted</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {pendingList.map(m => {
                        const name = `${m.first_name} ${m.last_name}`
                        return (
                          <tr key={m.id}>
                            <td>
                              <div className="user-cell">
                                <div className="user-ava-sm">{initials(name)}</div>
                                <div className="user-name-sm">{name}</div>
                              </div>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>{m.email}</td>
                            <td>{m.class_set || '—'}</td>
                            <td>{m.profession || '—'}</td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                              {m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB') : '—'}
                            </td>
                            <td>
                              <div className="a-actions">
                                <button className="btn btn-success btn-sm" onClick={() => approveUser(m.id)}>✓ Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => rejectUser(m.id)}>✗ Reject</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {pendingList.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
                          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                          No pending approvals
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== NOMINATIONS ===== */}
            {activeNav === 'nominations' && (
              <div className="admin-card">
                <div className="admin-card-hdr">
                  <h3>Alumni Nominations ({nominationsList.length})</h3>
                </div>
                <div className="admin-card-body" style={{ overflowX: 'auto' }}>
                  <table className="a-table">
                    <thead>
                      <tr><th>Nominee</th><th>Nominator</th><th>Month</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {nominationsList.map(n => {
                        const h = honoree(n)
                        return (
                          <tr key={n.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Avatar photoUrl={h.photoUrl} name={h.name} className="mp-option-avatar" />
                                <div>
                                  <div style={{ fontWeight: 600 }}>{h.name}</div>
                                  <div style={{ fontSize: '.78rem', color: 'var(--gray-500)' }}>{h.subtitle}</div>
                                </div>
                              </div>
                            </td>
                            <td>{n.nominator_first_name ? `${n.nominator_first_name} ${n.nominator_last_name}` : 'Unknown'}</td>
                            <td>{n.month_year || '—'}</td>
                            <td style={{ maxWidth: 200, fontSize: '0.85rem' }}>
                              <div style={{ maxHeight: '60px', overflowY: 'auto' }}>
                                {n.reason}
                              </div>
                            </td>
                            <td>
                              <span className={`badge badge-${n.status === 'selected' ? 'green' : n.status === 'rejected' ? 'red' : 'yellow'}`} style={n.status === 'pending' ? { background: '#FFC107', color: '#000' } : {}}>
                                {n.status === 'selected' ? 'Alumni of the Month' : n.status}
                              </span>
                            </td>
                            <td>
                              <div className="a-actions">
                                {n.status !== 'selected' && (
                                  <button
                                    className="btn btn-success btn-xs"
                                    onClick={() => selectNomination(n, h.name)}
                                  >
                                    Make Alumni of the Month
                                  </button>
                                )}
                                {n.status === 'pending' && (
                                  <button className="btn btn-danger btn-xs" onClick={() => rejectNomination(n.id)}>Reject</button>
                                )}
                                <button className="btn btn-outline btn-xs" style={{ color: 'red', borderColor: 'red' }} onClick={() => deleteNomination(n.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {nominationsList.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>No nominations found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== NEWS ===== */}
            {activeNav === 'news' && (
              <div className="admin-card">
                <div className="admin-card-hdr">
                  <h3>News & Articles ({newsList.length})</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowNewsModal(true)}>+ New Article</button>
                </div>
                <div className="admin-card-body">
                  <table className="a-table">
                    <thead>
                      <tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {newsList.map(n => (
                        <tr key={n.id}>
                          <td style={{ maxWidth: 280 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{n.title}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>{n.excerpt ? n.excerpt.substring(0, 60) : ''}…</div>
                          </td>
                          <td><span className="badge badge-green">{n.category}</span></td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                            {n.created_at ? new Date(n.created_at).toLocaleDateString('en-GB') : '—'}
                          </td>
                          <td>
                            <span className={n.status === 'published' ? 'badge badge-green' : 'badge'} style={n.status !== 'published' ? { background: '#FFC107', color: '#000' } : {}}>
                              {n.status || 'Published'}
                            </span>
                          </td>
                          <td>
                            <div className="a-actions">
                              <button className="btn btn-danger btn-xs" onClick={() => deleteNews(n.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {newsList.length === 0 && (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>No articles found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== EVENTS ===== */}
            {activeNav === 'events' && (
              <div className="admin-card">
                <div className="admin-card-hdr">
                  <h3>Events ({eventsList.length})</h3>
                  <button className="btn btn-primary btn-sm">+ New Event</button>
                </div>
                <div className="admin-card-body">
                  <table className="a-table">
                    <thead>
                      <tr><th>Event</th><th>Date</th><th>Location</th><th>Type</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {eventsList.map(ev => (
                        <tr key={ev.id}>
                          <td style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ev.title}</td>
                          <td style={{ fontSize: '0.85rem' }}>
                            {ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{ev.location || '—'}</td>
                          <td><span className="badge badge-green">{ev.type || 'General'}</span></td>
                          <td>
                            <div className="a-actions">
                              <button className="btn btn-danger btn-xs">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {eventsList.length === 0 && (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>No events scheduled.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== MESSAGES ===== */}
            {activeNav === 'messages' && (
              <div className="admin-card">
                <div className="admin-card-hdr"><h3>Admin Messages</h3></div>
                <div className="admin-card-body" style={{ padding: '60px', textAlign: 'center', color: 'var(--gray-500)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div>
                  <p>Message management coming soon.</p>
                  <Link to="/messages" className="btn btn-outline btn-sm mt-16">Go to Messages</Link>
                </div>
              </div>
            )}

            {/* ===== SETTINGS ===== */}
            {activeNav === 'settings' && (
              <div style={{ display: 'grid', gap: 20 }}>
                <div className="admin-card">
                  <div className="admin-card-hdr"><h3>System Settings</h3></div>
                  <div className="admin-card-body" style={{ padding: 24 }}>
                    {[
                      { label: 'Site Name', value: 'BASEGA Alumni Association' },
                      { label: 'Contact Email', value: 'info@basega.org' },
                      { label: 'Membership Registration', value: 'Open' },
                      { label: 'Email Notifications', value: 'Enabled' },
                    ].map(s => (
                      <div key={s.label} className="info-row">
                        <span className="lbl">{s.label}</span>
                        <span className="val">{s.value}</span>
                        <button className="btn btn-outline btn-xs" style={{ marginLeft: 'auto' }}>Edit</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-hdr">
                    <h3>Change Admin Password</h3>
                  </div>
                  <div className="admin-card-body" style={{ padding: 24 }}>
                    <p style={{ color: 'var(--gray-500)', marginTop: 0 }}>Update the password for the admin account currently signed in.</p>
                    <form onSubmit={changeAdminPassword} style={{ maxWidth: 520 }}>
                      <label className="db-field"><span>Current Password</span><input className="form-control" type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={setPasswordField} required autoComplete="current-password" /></label>
                      <label className="db-field"><span>New Password</span><input className="form-control" type="password" name="newPassword" value={passwordForm.newPassword} onChange={setPasswordField} required minLength="6" autoComplete="new-password" /></label>
                      <label className="db-field"><span>Confirm New Password</span><input className="form-control" type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={setPasswordField} required minLength="6" autoComplete="new-password" /></label>
                      {passwordState.message && <p className="db-form-success">{passwordState.message}</p>}
                      {passwordState.error && <p className="db-form-error">{passwordState.error}</p>}
                      <button className="btn btn-primary" type="submit" disabled={passwordState.saving}>{passwordState.saving ? 'Updating...' : 'Update Admin Password'}</button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Article</h3>
            <form onSubmit={handleCreateNews} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input required type="text" placeholder="Article Title" value={newsFormData.title} onChange={e => setNewsFormData({ ...newsFormData, title: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />
              <input type="text" placeholder="Short Excerpt (optional)" value={newsFormData.excerpt} onChange={e => setNewsFormData({ ...newsFormData, excerpt: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />
              <select value={newsFormData.category} onChange={e => setNewsFormData({ ...newsFormData, category: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}>
                <option value="General">General</option>
                <option value="Announcements">Announcements</option>
                <option value="Careers">Careers</option>
              </select>
              <input type="text" placeholder="Cover Image URL (optional)" value={newsFormData.imageUrl} onChange={e => setNewsFormData({ ...newsFormData, imageUrl: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />
              <textarea required placeholder="Full Article Body" value={newsFormData.body} onChange={e => setNewsFormData({ ...newsFormData, body: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '150px', fontSize: '1rem', fontFamily: 'inherit' }}></textarea>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowNewsModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
