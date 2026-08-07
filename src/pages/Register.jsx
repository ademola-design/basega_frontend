import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api/client'
import PasswordInput from '../components/PasswordInput'

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
]

const INDUSTRIES = [
  'Technology / ICT','Banking / Finance','Medicine / Healthcare','Law / Legal',
  'Education / Academia','Engineering','Oil & Gas','Public Service / Government',
  'Media / Communications','Agriculture','Arts / Entertainment',
  'Business / Entrepreneurship','Other',
]

const TITLES = ['Dr.', 'Prof.', 'Engr.', 'Barr.', 'Arc.', 'Pharm.', 'Chief', 'Rev.', 'Pastor', 'Alhaji', 'Alhaja', 'Mr.', 'Mrs.', 'Ms.']
const CLASS_SETS = Array.from({ length: 2026 - 1981 + 1 }, (_, i) => 2026 - i)

const STEPS = ['Personal Info', 'Academic Details', 'Professional Info', 'Review & Submit']

function StepBar({ current }) {
  return (
    <div className="steps-bar">
      {STEPS.map((label, i) => {
        const num = i + 1
        const done   = num < current
        const active = num === current
        return (
          <div key={num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className="step-item">
              <div className={`step-num${active ? ' active' : done ? ' done' : ''}`}>
                {done ? '✓' : num}
              </div>
              <div className={`step-label${active ? ' active' : done ? ' done' : ''}`}>{label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line${done ? ' done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="review-row-item">
      <div className="review-row-label">{label}</div>
      <div className="review-row-value">{value || '—'}</div>
    </div>
  )
}

export default function Register() {
  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum]       = useState('')
  const [errors, setErrors]       = useState([])
  const [loading, setLoading]     = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [photo, setPhoto]               = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoError, setPhotoError]     = useState('')

  const [form, setForm] = useState({
    title: '', firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    gender: '', dob: '', city: '', state: 'Lagos',
    classSet: '', studentId: '', house: '', classTeacher: '', waecNum: '', referee: '',
    profession: '', company: '', industry: '', linkedin: '', bio: '', referralSource: '',
    agreeTerms: false,
  })

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  }

  // Checked here as well as on the server so the member finds out now, rather
  // than after filling in three more steps.
  function handlePhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''            // let them re-pick the same file after an error
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('Please choose a JPEG, PNG or WebP image.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError('That image is too large. Please use a file under 3MB.')
      return
    }

    setPhotoError('')
    setPhoto(file)
    setPhotoPreview(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  function clearPhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(null)
    setPhotoPreview('')
    setPhotoError('')
  }

  // Release the last preview blob when leaving the page.
  useEffect(() => () => { if (photoPreview) URL.revokeObjectURL(photoPreview) }, [photoPreview])

  function validateStep(s) {
    const required = {
      1: ['firstName', 'lastName', 'email', 'phone', 'city', 'state', 'password', 'confirmPassword'],
      2: ['classSet'],
      3: ['profession'],
    }
    const missing = (required[s] || []).filter(k => !form[k]?.trim?.())
    const extraErrors = []
    if (s === 1) {
      if (form.password && form.password.length < 6) {
        extraErrors.push('passwordShort')
      }
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        extraErrors.push('passwordMismatch')
      }
    }
    const allErrors = [...missing, ...extraErrors]
    setErrors(allErrors)
    return allErrors.length === 0
  }

  function next() {
    if (!validateStep(step)) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function prev() {
    setStep(s => s - 1)
    setErrors([])
    setSubmitError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit() {
    if (!form.agreeTerms) { setErrors(['agreeTerms']); return }
    setLoading(true)
    setSubmitError('')
    setErrors([])
    try {
      const data = await authAPI.register(form, photo)
      setRefNum(data.refNumber)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const err = field => errors.includes(field)

  if (submitted) {
    return (
      <div className="page-layout">
        <div className="reg-page">
          <div className="container">
            <div className="reg-card reg-success" style={{ display: 'block' }}>
              <div className="success-icon">✓</div>
              <h2>Registration Submitted!</h2>
              <p>Thank you for registering with the BASEGA Alumni Association. Your application is now pending admin review. You will receive an email confirmation shortly.</p>
              <div className="ref-box">{refNum}</div>
              <p className="reg-success-note">Save your reference number for future correspondence with the secretariat.</p>
              <div className="reg-success-actions">
                <Link to="/"         className="btn btn-primary">Go to Homepage</Link>
                <Link to="/payment"  className="btn btn-outline">Pay Annual Dues</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-layout">
      <div className="reg-hero">
        <div className="container">
          <h1>Alumni Registration</h1>
          <p>Join the BASEGA Alumni Association. Complete the form below and our team will verify your membership within 3–5 working days.</p>
        </div>
      </div>

      <div className="reg-page">
        <div className="container">
          <StepBar current={step} />

          <div className="reg-layout">
            <div>
              <div className="reg-card">
                {submitError && (
                  <div className="alert alert-danger" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: 20, fontSize: '0.9rem' }}>
                    {submitError}
                  </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <div className="reg-card-head">
                      <div className="reg-card-head-num">1</div>
                      <div>
                        <div className="reg-card-head-title">Personal Information</div>
                        <div className="reg-card-head-sub">Tell us about yourself — this forms your member profile</div>
                      </div>
                    </div>
                    <div className="reg-card-body">
                      <div className="form-group">
                        <label className="form-label">Profile Photo</label>
                        <div className="reg-photo-row">
                          <div className={`reg-photo-preview${photoPreview ? ' has-image' : ''}`}>
                            {photoPreview
                              ? <img src={photoPreview} alt="Your profile photo preview" className="avatar-img" />
                              : '👤'}
                          </div>
                          <div className="reg-photo-actions">
                            <label className="reg-photo-btn">
                              {photo ? 'Choose a different photo' : 'Upload a photo'}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePhoto}
                                style={{ display: 'none' }}
                              />
                            </label>
                            {photo && (
                              <button type="button" className="reg-photo-remove" onClick={clearPhoto}>
                                Remove photo
                              </button>
                            )}
                          </div>
                        </div>
                        {photoError && <div className="form-error">{photoError}</div>}
                        <div className="form-hint">
                          Optional. JPEG, PNG or WebP, up to 3MB. Shown on your profile, your
                          dashboard, and the Alumni of the Month feature if you are honoured.
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Title / Honorific</label>
                        <select className="form-control" value={form.title} onChange={set('title')}>
                          <option value="">— Select Title (optional) —</option>
                          {TITLES.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <div className="form-hint">e.g. Dr., Prof., Engr., Chief — leave blank if none applies</div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">First Name <span className="req">*</span></label>
                          <input className={`form-control${err('firstName') ? ' input-error' : ''}`} value={form.firstName} onChange={set('firstName')} placeholder="e.g. Adebayo" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Last Name <span className="req">*</span></label>
                          <input className={`form-control${err('lastName') ? ' input-error' : ''}`} value={form.lastName} onChange={set('lastName')} placeholder="e.g. Johnson" />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Email Address <span className="req">*</span></label>
                          <input type="email" className={`form-control${err('email') ? ' input-error' : ''}`} value={form.email} onChange={set('email')} placeholder="your@email.com" />
                          <div className="form-hint">This will be your membership login email</div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number <span className="req">*</span></label>
                          <input type="tel" className={`form-control${err('phone') ? ' input-error' : ''}`} value={form.phone} onChange={set('phone')} placeholder="+234 803 000 0000" />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Password <span className="req">*</span></label>
                          <PasswordInput
                            className="form-control"
                            invalid={err('password') || err('passwordShort')}
                            value={form.password}
                            onChange={set('password')}
                            placeholder="Minimum 6 characters"
                            autoComplete="new-password"
                          />
                          {err('passwordShort') && <div className="form-error" style={{ color: 'var(--red-600)', fontSize: '0.8rem', marginTop: 4 }}>Password must be at least 6 characters.</div>}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Confirm Password <span className="req">*</span></label>
                          <PasswordInput
                            className="form-control"
                            invalid={err('confirmPassword') || err('passwordMismatch')}
                            value={form.confirmPassword}
                            onChange={set('confirmPassword')}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                          />
                          {err('passwordMismatch') && <div className="form-error" style={{ color: 'var(--red-600)', fontSize: '0.8rem', marginTop: 4 }}>Passwords do not match.</div>}
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Gender</label>
                          <select className="form-control" value={form.gender} onChange={set('gender')}>
                            <option value="">— Select —</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Prefer not to say</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date of Birth</label>
                          <input type="date" className="form-control" value={form.dob} onChange={set('dob')} />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">City / Town <span className="req">*</span></label>
                          <input className={`form-control${err('city') ? ' input-error' : ''}`} value={form.city} onChange={set('city')} placeholder="e.g. Lagos" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">State <span className="req">*</span></label>
                          <select className={`form-control${err('state') ? ' input-error' : ''}`} value={form.state} onChange={set('state')}>
                            <option value="">— Select State —</option>
                            {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <div className="reg-card-head">
                      <div className="reg-card-head-num">2</div>
                      <div>
                        <div className="reg-card-head-title">Academic Details</div>
                        <div className="reg-card-head-sub">Your BASEGA school record — used to verify your alumni status</div>
                      </div>
                    </div>
                    <div className="reg-card-body">
                      <div className="info-notice">
                        Your graduation year and student details will be cross-checked against our school records during the admin verification process.
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Class Set <span className="req">*</span></label>
                          <select className={`form-control${err('classSet') ? ' input-error' : ''}`} value={form.classSet} onChange={set('classSet')}>
                            <option value="">— Select Your Set —</option>
                            {CLASS_SETS.map(y => <option key={y} value={y}>Set of {y}</option>)}
                          </select>
                          <div className="form-hint">The year you graduated from BASEGA</div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Student / Admission Number</label>
                          <input className="form-control" value={form.studentId} onChange={set('studentId')} placeholder="e.g. BSGA/2019/001" />
                          <div className="form-hint">If you remember your student number</div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">House / Set Name</label>
                        <input className="form-control" value={form.house} onChange={set('house')} placeholder="e.g. Nnamdi Azikiwe House" />
                        <div className="form-hint">Your boarding house or set name at BASEGA (optional)</div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Class Teacher / Form Master (if remembered)</label>
                        <input className="form-control" value={form.classTeacher} onChange={set('classTeacher')} placeholder="e.g. Mr. Adeyemi" />
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">WAEC / NECO Index Number</label>
                          <input className="form-control" value={form.waecNum} onChange={set('waecNum')} placeholder="e.g. 5123456789" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Referee (Existing BASEGA Alumni)</label>
                          <input className="form-control" value={form.referee} onChange={set('referee')} placeholder="Full name of referring member" />
                          <div className="form-hint">An existing financial member who can vouch for you</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <>
                    <div className="reg-card-head">
                      <div className="reg-card-head-num">3</div>
                      <div>
                        <div className="reg-card-head-title">Professional Information</div>
                        <div className="reg-card-head-sub">Your current career details for the members directory</div>
                      </div>
                    </div>
                    <div className="reg-card-body">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Profession / Job Title <span className="req">*</span></label>
                          <input className={`form-control${err('profession') ? ' input-error' : ''}`} value={form.profession} onChange={set('profession')} placeholder="e.g. Software Engineer" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Organisation / Company</label>
                          <input className="form-control" value={form.company} onChange={set('company')} placeholder="e.g. MTN Nigeria" />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Industry / Sector</label>
                          <select className="form-control" value={form.industry} onChange={set('industry')}>
                            <option value="">— Select Industry —</option>
                            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">LinkedIn Profile URL</label>
                          <input type="url" className="form-control" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/your-name" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Short Bio</label>
                        <textarea className="form-control" value={form.bio} onChange={set('bio')} placeholder="Tell the alumni community about yourself — your career journey, achievements, and interests (max 250 words)…" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">How did you hear about us?</label>
                        <select className="form-control" value={form.referralSource} onChange={set('referralSource')}>
                          <option value="">— Select —</option>
                          <option>Another alumni member</option>
                          <option>Social media (Facebook/Instagram/Twitter)</option>
                          <option>WhatsApp group</option>
                          <option>BASEGA Secondary School</option>
                          <option>Website / Google search</option>
                          <option>Email</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <>
                    <div className="reg-card-head">
                      <div className="reg-card-head-num">4</div>
                      <div>
                        <div className="reg-card-head-title">Review &amp; Submit</div>
                        <div className="reg-card-head-sub">Confirm your details before submitting for verification</div>
                      </div>
                    </div>
                    <div className="reg-card-body">
                      <div className="review-grid">
                        <ReviewRow label="Full Name"    value={`${form.title ? form.title + ' ' : ''}${form.firstName} ${form.lastName}`} />
                        <ReviewRow label="Email"        value={form.email} />
                        <ReviewRow label="Phone"        value={form.phone} />
                        <ReviewRow label="Location"     value={`${form.city}, ${form.state}`} />
                        <ReviewRow label="Class Set"    value={form.classSet ? `Set of ${form.classSet}` : ''} />
                        <ReviewRow label="Profession"   value={form.profession} />
                        <ReviewRow label="Organisation" value={form.company} />
                      </div>
                      <div className="reg-verify-notice">
                        <strong>Verification Process</strong><br />
                        After submission, your registration will be reviewed by the admin team within 3–5 working days. You will receive a confirmation email at the address provided once your membership is approved.
                      </div>
                      <div className={`form-group form-group--consent${err('agreeTerms') ? ' consent-error' : ''}`}>
                        <input type="checkbox" id="agree-terms" checked={form.agreeTerms} onChange={set('agreeTerms')} />
                        <label htmlFor="agree-terms">
                          I confirm that the information provided is accurate and truthful. I agree to the{' '}
                          <a href="#">BASEGA Alumni Association Terms &amp; Conditions</a>{' '}
                          and understand that false information may result in rejection or removal of my membership.
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* Nav */}
                <div className="reg-nav">
                  <button
                    className="btn-prev"
                    onClick={prev}
                    style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                    disabled={loading}
                  >
                    ← Previous
                  </button>
                  <div className="reg-nav-counter">Step {step} of {STEPS.length}</div>
                  {step < STEPS.length ? (
                    <button className="btn-next" onClick={next}>Next →</button>
                  ) : (
                    <button className="btn-next" onClick={submit} disabled={loading}>
                      {loading ? 'Submitting…' : 'Submit Registration'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="reg-sidebar">
              <div className="reg-info-card">
                <h4>Who can register?</h4>
                <ul>
                  <li>Any former student of BASEGA Secondary School, Nigeria</li>
                  <li>Must have a verifiable graduation year</li>
                  <li>Registration is free; annual dues apply for financial membership</li>
                </ul>
              </div>
              <div className="reg-info-card">
                <h4>Verification steps</h4>
                <ul>
                  <li>Submit this form</li>
                  <li>Admin cross-checks school records</li>
                  <li>Approval email sent within 3–5 days</li>
                  <li>Pay annual dues to become a financial member</li>
                </ul>
              </div>
              <div className="reg-info-card">
                <h4>Need help?</h4>
                <ul>
                  <li><a href="mailto:info@basegaalumni.ng">info@basegaalumni.ng</a></li>
                  <li>+234 800 100 0000</li>
                  <li>Mon – Fri, 9 am – 5 pm WAT</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
