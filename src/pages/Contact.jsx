import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const FAQS = [
  { q: 'How do I become a BASEGA member?', a: 'All graduates of Basega Secondary School are automatically alumni. To register as an active member, pay the annual subscription of ₦10,000 via the Payment page and contact the secretariat to have your profile created.' },
  { q: 'How much is the annual subscription?', a: 'The annual subscription fee is ₦10,000. Life membership is available for ₦100,000 (one-time payment). Payments can be made via MTN MoMo, OPay, PalmPay, Paystack, or direct bank transfer.' },
  { q: 'Can I apply for a scholarship for my child?', a: 'The BASEGA Scholarship Fund supports current students of Basega Secondary School, not family members of alumni. Active paid-up alumni in good standing may nominate deserving students for consideration.' },
  { q: 'How do I join a committee?', a: 'Contact the secretariat expressing your interest and the committee you wish to join. Committees are open to all active members in good standing. Elections for leadership roles occur at the Annual General Meeting (AGM).' },
  { q: 'Where is the BASEGA secretariat?', a: 'Our secretariat is located at 7 Adetokunbo Ademola Street, Victoria Island, Lagos, Nigeria. Office hours are Monday to Friday, 08:00–17:00 WAT. You can also reach us via email or WhatsApp.' },
  { q: 'How do I update my member profile?', a: 'Log in to the member portal and navigate to your profile settings. Alternatively, send your updated details (name, phone, company, profession, location) to info@basegaalumni.ng and we will update your record within 48 hours.' },
]

const contactDetails = [
  { title: 'Office Address', text: 'BASEGA Secretariat, 15 Alumni Way, Victoria Island, Lagos, Nigeria' },
  { title: 'Phone',          text: '+234 800 100 0000' },
  { title: 'Email',          text: 'info@basegaalumni.ng' },
  { title: 'Office Hours',   text: 'Monday–Friday, 08:00–17:00 WAT' },
]

const socials = ['f', 'X', 'W', 'in', 'ig']

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '', privacy: false })
  const [sent,    setSent]    = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="page-layout">
      <PageHeader
        title="Contact Us"
        eyebrow="Get in Touch"
        subtitle="Reach out to the BASEGA Alumni Nigeria secretariat — we would love to hear from you"
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="contact-layout">

            {/* Left column — info card + map */}
            <div>
              <div className="contact-info-card">
                <h2>Get in Touch</h2>
                <p>Whether you have a question, want to propose an initiative, or simply want to reconnect — our team is happy to help alumni across all 36 states of Nigeria and the diaspora.</p>

                {contactDetails.map(d => (
                  <div key={d.title} className="contact-detail">
                    <div className="contact-detail-text">
                      <h4>{d.title}</h4>
                      <p>{d.text}</p>
                    </div>
                  </div>
                ))}

                <div className="contact-social">
                  {socials.map((s, i) => (
                    <a key={i} href="#" className="contact-social-btn" aria-label={s}>{s}</a>
                  ))}
                </div>
              </div>

              <div className="map-placeholder">
                <strong>BASEGA Alumni Nigeria — Victoria Island, Lagos</strong>
                <p className="map-note">Google Maps integration would appear here in production</p>
              </div>
            </div>

            {/* Right column — form */}
            <div className="contact-form-card">
              <h2>Send a Message</h2>
              <p>We'll get back to you within 2 business days.</p>

              {sent && (
                <div className="alert alert-success">
                  Thank you — your message has been sent. We will respond within 2 business days.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+234 803 ..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className="form-control" name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Select a subject…</option>
                    <option>Membership Enquiry</option>
                    <option>Event Information</option>
                    <option>Scholarship Application</option>
                    <option>Committee Interest</option>
                    <option>Payment / Subscription</option>
                    <option>Media / Press</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-control" name="message" value={form.message} onChange={handleChange} placeholder="Write your message here…" rows={5} required />
                </div>

                <div className="form-group form-group--checkbox">
                  <input type="checkbox" id="privacy" name="privacy" checked={form.privacy} onChange={handleChange} required />
                  <label htmlFor="privacy">I agree to the privacy policy and consent to being contacted by BASEGA Alumni Nigeria.</label>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container container-narrow">
          <div className="text-center">
            <div className="eyebrow-gold">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
              Quick answers to common queries from BASEGA alumni across Nigeria
            </p>
          </div>

          <div>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-chevron">{openFaq === i ? '▲' : '▼'}</span>
                </div>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
