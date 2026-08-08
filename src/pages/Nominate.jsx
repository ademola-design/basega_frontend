import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { nominationsAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import MemberPicker from '../components/MemberPicker'
import Avatar from '../components/Avatar'
import { honoree } from '../lib/honoree'

const CATEGORIES = [
  'Professional Excellence',
  'Community Service & Philanthropy',
  'Academic & Research Achievement',
  'Entrepreneurship & Business Innovation',
  'Public Service & Governance',
  'Arts, Culture & Media',
  'Sports & Athletics',
  'Healthcare & Medicine',
  'Technology & Innovation',
  'Youth & Education Advocacy',
]

const RELATIONS = [
  'Classmate / Schoolmate','Colleague','Friend','Family member',
  'Community member','Self-nomination','Other',
]

const GRAD_YEARS = Array.from({ length: 57 }, (_, i) => 2026 - i)

export default function Nominate() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]       = useState([])
  const [reasonLen, setReasonLen] = useState(0)
  const { user } = useAuth()
  const isLoggedIn = !!user
  const [loading, setLoading]     = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errorAttempt, setErrorAttempt] = useState(0)
  const alertRef = useRef(null)

  // The nominee is a member row from the directory, not typed-in text — that
  // link is what lets their profile photo appear on the honoree feature.
  const [nominee, setNominee] = useState(null)

  // Sidebar spotlight. Null until loaded, and stays null when no one has been
  // crowned yet — the sidebar shows a placeholder rather than inventing a name.
  const [currentHonoree, setCurrentHonoree] = useState(null)

  useEffect(() => {
    nominationsAPI.current()
      .then(nom => { if (nom) setCurrentHonoree(honoree(nom)) })
      .catch(() => {})   // a quiet sidebar beats blocking the form
  }, [])

  const [form, setForm] = useState({
    category: '', reason: '', achievements: '',
    subName: '', subEmail: '', subYear: '', subRelation: '', consent: false,
  })

  // Prefill the submitter fields from the signed-in member.
  useEffect(() => {
    if (!user) return
    setForm(f => ({
      ...f,
      subName:  `${user.firstName} ${user.lastName}`,
      subEmail: user.email,
    }))
  }, [user])

  function set(field) {
    return e => setForm(f => ({
      ...f,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))
  }

  function handleReasonChange(e) {
    setForm(f => ({ ...f, reason: e.target.value }))
    setReasonLen(e.target.value.length)
  }

  function validate() {
    const required = ['category', 'reason', 'subName', 'subEmail']
    const missing  = required.filter(k => !form[k]?.trim?.())
    const extra    = []
    if (!nominee) extra.push('nominee')
    if (form.reason.trim().length < 50) extra.push('reasonShort')
    if (!form.consent) extra.push('consent')
    const all = [...missing, ...extra]
    setErrors(all)
    return all.length === 0
  }

  /**
   * The submit button sits below the fold, so a silent failure looks like a
   * dead button. Record the problem and bump attempt — the effect below then
   * scrolls it into view.
   *
   * attempt increments even when the message repeats, so a second identical
   * failure still scrolls instead of being swallowed as "no state change".
   */
  function showProblem(message) {
    setSubmitError(message)
    setErrorAttempt(n => n + 1)
  }

  // useEffect (not requestAnimationFrame) — it runs after React commits the
  // DOM, and unlike rAF it is not throttled when the tab is in the background.
  useEffect(() => {
    if (!errorAttempt) return
    const target = alertRef.current || document.querySelector('.input-error')
    if (!target) return

    // scrollTo with a computed offset rather than scrollIntoView, so the
    // sticky navbar cannot cover the message we just scrolled to.
    const NAV_CLEARANCE = 90
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, [errorAttempt])

  async function handleSubmit() {
    if (!isLoggedIn) {
      showProblem('Please sign in to submit a nomination.')
      return
    }
    if (!validate()) {
      showProblem('Please complete the highlighted fields below.')
      return
    }

    setLoading(true)
    setSubmitError('')
    try {
      await nominationsAPI.nominate({
        nomineeMemberId: nominee.id,
        reason: form.reason,
      })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      showProblem(err.message || 'Failed to submit nomination.')
    } finally {
      setLoading(false)
    }
  }

  const err = field => errors.includes(field)

  if (submitted) {
    return (
      <div className="page-layout">
        <div className="nom-page">
          <div className="container">
            <div className="nom-form-card nom-success" style={{ display: 'block' }}>
              <div className="s-icon">✓</div>
              <h2>Nomination Submitted!</h2>
              <p>Thank you for your nomination. The BASEGA Alumni Association admin team will review it and get back to you within 5–7 working days.</p>
              <div className="nom-success-actions">
                <Link to="/alumni-of-month" className="btn btn-primary">Alumni of the Month</Link>
                <Link to="/" className="btn btn-outline">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-layout">
      <div className="nom-hero">
        <div className="container">
          <div className="nom-hero-eyebrow">Nominations</div>
          <h1>Nominate an Outstanding Alumnus</h1>
          <p>Know a BASEGA graduate making a significant impact in their career or community? Submit a nomination and help us celebrate their achievements.</p>
        </div>
      </div>

      <div className="nom-page">
        <div className="container">
          <div className="nom-layout">
            <div>
              <div className="nom-form-card">

                {/* Why a submit attempt failed. Without this, the button below
                    the fold looked dead when validation or the API rejected. */}
                {submitError && (
                  <div className="nom-alert" role="alert" ref={alertRef}>
                    <span className="nom-alert-icon">!</span>
                    <div>
                      {submitError}
                      {!isLoggedIn && (
                        <> <Link to="/login" className="nom-alert-link">Log in</Link> or{' '}
                        <Link to="/register" className="nom-alert-link">create an account</Link>.</>
                      )}
                    </div>
                  </div>
                )}

                {!isLoggedIn && !submitError && (
                  <div className="nom-alert nom-alert-info">
                    <span className="nom-alert-icon">i</span>
                    <div>
                      You need to be signed in to submit a nomination.{' '}
                      <Link to="/login" className="nom-alert-link">Log in</Link> or{' '}
                      <Link to="/register" className="nom-alert-link">create an account</Link>.
                    </div>
                  </div>
                )}

                {/* Nominee Info */}
                <div className="nom-section">
                  <div className="nom-section-title">Nominee Information</div>
                  <div className="form-group">
                    <label className="form-label">Which member are you nominating? <span className="req">*</span></label>
                    <MemberPicker
                      value={nominee}
                      onChange={m => { setNominee(m); setErrors(es => es.filter(e => e !== 'nominee')) }}
                      invalid={err('nominee')}
                      excludeId={user?.id}
                    />
                    {err('nominee') && <div className="form-error">Please choose the member you are nominating.</div>}
                  </div>
                </div>

                {/* Reason */}
                <div className="nom-section">
                  <div className="nom-section-title">Why Are You Nominating Them?</div>
                  <div className="form-group">
                    <label className="form-label">Category of Achievement <span className="req">*</span></label>
                    <select className={`form-control${err('category') ? ' input-error' : ''}`} value={form.category} onChange={set('category')}>
                      <option value="">— Select Category —</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reason for Nomination <span className="req">*</span></label>
                    <div className="char-wrap">
                      <textarea
                        className={`form-control${err('reason') || err('reasonShort') ? ' input-error' : ''}`}
                        maxLength={600}
                        rows={6}
                        value={form.reason}
                        onChange={handleReasonChange}
                        placeholder="Describe why this alumnus deserves to be recognised. Include specific achievements, community impact, career milestones, and how they embody the BASEGA spirit. (50–600 characters)"
                      />
                      <span className={`char-count${reasonLen > 540 ? ' warn' : ''}${reasonLen >= 600 ? ' over' : ''}`}>{reasonLen} / 600</span>
                    </div>
                    <div className="form-hint">Be as specific as possible — strong nominations include concrete examples and measurable impact</div>
                    {err('reasonShort') && <div className="form-error">Please provide at least 50 characters.</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Key Achievements (one per line)</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={form.achievements}
                      onChange={set('achievements')}
                      placeholder={'e.g. Founded a free medical clinic serving 500+ patients monthly\nWHO Africa Young Scientist Award 2024\nPublished in Nature Medicine journal'}
                    />
                    <div className="form-hint">List up to 5 notable achievements. Each line becomes a bullet point.</div>
                  </div>
                </div>

                {/* Nominator */}
                <div className="nom-section">
                  <div className="nom-section-title">Your Details (Nominator)</div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Your Full Name <span className="req">*</span></label>
                      <input className={`form-control${err('subName') ? ' input-error' : ''}`} value={form.subName} onChange={set('subName')} placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Email <span className="req">*</span></label>
                      <input type="email" className={`form-control${err('subEmail') ? ' input-error' : ''}`} value={form.subEmail} onChange={set('subEmail')} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Your Graduation Year</label>
                      <select className="form-control" value={form.subYear} onChange={set('subYear')}>
                        <option value="">— Select Year —</option>
                        {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Relationship to Nominee</label>
                      <select className="form-control" value={form.subRelation} onChange={set('subRelation')}>
                        <option value="">— Select —</option>
                        {RELATIONS.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={`form-group form-group--consent${err('consent') ? ' consent-error' : ''}`}>
                    <input type="checkbox" id="nom-consent" checked={form.consent} onChange={set('consent')} />
                    <label htmlFor="nom-consent">
                      I confirm this nomination is genuine. I understand that the BASEGA Alumni Association admin team will review it and may contact me for more information. False or malicious nominations may result in removal of my membership.
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="nom-submit-bar">
                  <span className="form-security-note">Your information is kept confidential</span>
                  <button
                    className="btn-submit-nom"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Submitting…' : 'Submit Nomination'}
                  </button>
                </div>

              </div>
            </div>

            {/* Sidebar */}
            <aside className="nom-sidebar">
              {currentHonoree ? (
                <Link to="/alumni-of-month" className="current-featured">
                  <div className="cf-title">Alumni of the Month</div>
                  <Avatar
                    photoUrl={currentHonoree.photoUrl}
                    name={currentHonoree.name}
                    className="cf-avatar"
                  />
                  {currentHonoree.monthYear && (
                    <div className="cf-badge">for {currentHonoree.monthYear}</div>
                  )}
                  <div className="cf-name">{currentHonoree.name}</div>
                  <div className="cf-role">{currentHonoree.subtitle}</div>
                </Link>
              ) : (
                <div className="current-featured">
                  <div className="cf-avatar">★</div>
                  <div className="cf-name">No honoree yet</div>
                  <div className="cf-role">Your nomination could be the first.</div>
                </div>
              )}

              <div className="info-card">
                <h4>Selection Criteria</h4>
                <ul>
                  <li>Must be a BASEGA Secondary School alumnus</li>
                  <li>Demonstrated professional or community excellence</li>
                  <li>Positive impact beyond personal achievement</li>
                  <li>Embodies the BASEGA spirit of service and excellence</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Process &amp; Timeline</h4>
                <ul>
                  <li>Submit your nomination here</li>
                  <li>• Admin reviews within 5–7 working days</li>
                  <li>• Shortlisted nominees are contacted</li>
                  <li>• Winner announced on the 1st of each month</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Questions?</h4>
                <ul>
                  <li><a href="mailto:info@basegaalumni.ng">info@basegaalumni.ng</a></li>
                  <li>+234 800 100 0000</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
