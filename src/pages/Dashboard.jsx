import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI, membersAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import Navbar from '../components/Navbar'

const QUICK_LINKS = [
  // { to: '/payment',  label: 'Pay Annual Dues',     desc: '2026 dues: ₦25,000' },
  { to: '/members', label: 'Members Directory', desc: 'Find fellow alumni' },
  { to: '/events', label: 'Events', desc: 'Upcoming activities' },
  { to: '/news', label: 'Announcements', desc: 'Latest updates' },
  { to: '/jubilee', label: 'Jubilee 50th', desc: 'Anniversary updates' },
  { to: '/contact', label: 'Contact Secretariat', desc: 'Get in touch' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileForm, setProfileForm] = useState({
    phone: '', gender: '', house: '', city: '', state: '', profession: '',
    company: '', industry: '', linkedin: '', bio: '',
  })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [profileState, setProfileState] = useState({ saving: false, message: '', error: '' })
  const [passwordState, setPasswordState] = useState({ saving: false, message: '', error: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoState, setPhotoState] = useState({ saving: false, message: '', error: '' })

  // ProtectedRoute has already confirmed the session, so this only needs to
  // load the fuller profile. An expired token surfaces as a 401, which
  // AuthContext handles globally.
  useEffect(() => {
    authAPI.me()
      .then(data => {
        setProfile(data)
        setProfileForm({
          phone: data.phone || '', gender: data.gender || '', house: data.house || '',
          city: data.city || '', state: data.state || '', profession: data.profession || '',
          company: data.company || '', industry: data.industry || '',
          linkedin: data.linkedin || '', bio: data.bio || '',
        })
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  function setProfileField(event) {
    const { name, value } = event.target
    setProfileForm(current => ({ ...current, [name]: value }))
  }

  function selectPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoState({ saving: false, message: '', error: 'Please choose an image file.' })
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setPhotoState({ saving: false, message: '', error: 'That image is too large. Please use a file under 3MB.' })
      return
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setPhotoState({ saving: false, message: '', error: '' })
  }

  async function uploadPhoto() {
    if (!photoFile) return
    setPhotoState({ saving: true, message: '', error: '' })
    try {
      const result = await membersAPI.uploadPhoto(photoFile)
      setProfile(current => ({
        ...current,
        photo_url: result.photoUrl ? `${result.photoUrl}?v=${Date.now()}` : current.photo_url,
      }))
      setPhotoFile(null)
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      setPhotoPreview('')
      setPhotoState({ saving: false, message: 'Profile picture updated successfully.', error: '' })
    } catch (error) {
      setPhotoState({ saving: false, message: '', error: error.message || 'Unable to update your profile picture.' })
    }
  }

  async function saveProfile(event) {
    event.preventDefault()
    setProfileState({ saving: true, message: '', error: '' })
    try {
      await membersAPI.update(user.id, profileForm)
      const fresh = await authAPI.me()
      setProfile(fresh)
      setProfileState({ saving: false, message: 'Profile updated successfully.', error: '' })
    } catch (error) {
      setProfileState({ saving: false, message: '', error: error.message || 'Unable to update your profile.' })
    }
  }

  function setPasswordField(event) {
    const { name, value } = event.target
    setPasswordForm(current => ({ ...current, [name]: value }))
  }

  async function changePassword(event) {
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
      await authAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordState({ saving: false, message: 'Password updated successfully.', error: '' })
    } catch (error) {
      setPasswordState({ saving: false, message: '', error: error.message || 'Unable to update your password.' })
    }
  }

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
  const duesPaid = profile?.duesPaidThisYear || false
  const classSet = profile?.class_set ? `Set of ${profile.class_set}` : 'BASEGA Graduate'

  return (
    <>
      <Navbar />
      <div className="db-page">

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
            {/* <div className="db-status-card">
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
          </div> */}
            <div className="db-status-card">
              <div className={`db-status-dot ${memberStatus === 'financial' || memberStatus === 'approved' ? 'active-dot' : 'neutral-dot'}`} />
              <div>
                <div className="db-status-label">Membership</div>
                <div className="db-status-value" style={{ textTransform: 'capitalize' }}>
                  {memberStatus === 'financial' ? 'Financial Member' :
                    memberStatus === 'approved' ? 'Registered Member' :
                      memberStatus === 'pending' ? 'Pending Approval' : memberStatus}
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

          <div className="db-settings-grid">
            <section className="db-settings-card">
              <div className="db-section-head">
                <h2>Edit Profile</h2>
                <p>Keep your member information current.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--gray-200)' }}>
                <Avatar
                  photoUrl={photoPreview || profile?.photo_url || user?.photoUrl}
                  name={displayName}
                  className="db-avatar"
                />
                <div style={{ flex: 1 }}>
                  <label className="db-field" style={{ marginBottom: 8 }}><span>Profile Picture</span><input className="form-control" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} /></label>
                  <small style={{ color: 'var(--gray-500)' }}>JPG, PNG, or WebP. Maximum 3MB.</small>
                  {photoState.message && <p className="db-form-success">{photoState.message}</p>}
                  {photoState.error && <p className="db-form-error">{photoState.error}</p>}
                  {photoFile && <button className="btn btn-primary" type="button" onClick={uploadPhoto} disabled={photoState.saving}>{photoState.saving ? 'Uploading...' : 'Save Profile Picture'}</button>}
                </div>
              </div>
              <form onSubmit={saveProfile}>
                <div className="db-form-grid">
                  <label className="db-field"><span>Phone</span><input className="form-control" name="phone" value={profileForm.phone} onChange={setProfileField} /></label>
                  <label className="db-field"><span>Gender</span><select className="form-control" name="gender" value={profileForm.gender} onChange={setProfileField}><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></label>
                  <label className="db-field"><span>House / Set</span><input className="form-control" name="house" value={profileForm.house} onChange={setProfileField} /></label>
                  <label className="db-field"><span>City</span><input className="form-control" name="city" value={profileForm.city} onChange={setProfileField} /></label>
                  <label className="db-field"><span>State</span><input className="form-control" name="state" value={profileForm.state} onChange={setProfileField} /></label>
                  <label className="db-field"><span>Profession</span><input className="form-control" name="profession" value={profileForm.profession} onChange={setProfileField} /></label>
                  <label className="db-field"><span>Company</span><input className="form-control" name="company" value={profileForm.company} onChange={setProfileField} /></label>
                  <label className="db-field"><span>Industry</span><input className="form-control" name="industry" value={profileForm.industry} onChange={setProfileField} /></label>
                  <label className="db-field db-field-wide"><span>LinkedIn URL</span><input className="form-control" type="url" name="linkedin" value={profileForm.linkedin} onChange={setProfileField} /></label>
                  <label className="db-field db-field-wide"><span>Bio</span><textarea className="form-control" name="bio" rows="4" value={profileForm.bio} onChange={setProfileField} /></label>
                </div>
                {profileState.message && <p className="db-form-success">{profileState.message}</p>}
                {profileState.error && <p className="db-form-error">{profileState.error}</p>}
                <button className="btn btn-primary" type="submit" disabled={profileState.saving}>{profileState.saving ? 'Saving...' : 'Save Profile'}</button>
              </form>
            </section>

            <section className="db-settings-card">
              <div className="db-section-head">
                <h2>Reset Password</h2>
                <p>Choose a new password for your account.</p>
              </div>
              <form onSubmit={changePassword}>
                <label className="db-field"><span>Current Password</span><input className="form-control" type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={setPasswordField} required autoComplete="current-password" /></label>
                <label className="db-field"><span>New Password</span><input className="form-control" type="password" name="newPassword" value={passwordForm.newPassword} onChange={setPasswordField} required minLength="6" autoComplete="new-password" /></label>
                <label className="db-field"><span>Confirm New Password</span><input className="form-control" type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={setPasswordField} required minLength="6" autoComplete="new-password" /></label>
                {passwordState.message && <p className="db-form-success">{passwordState.message}</p>}
                {passwordState.error && <p className="db-form-error">{passwordState.error}</p>}
                <button className="btn btn-primary" type="submit" disabled={passwordState.saving}>{passwordState.saving ? 'Updating...' : 'Update Password'}</button>
              </form>
            </section>
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
    </>
  )
}
