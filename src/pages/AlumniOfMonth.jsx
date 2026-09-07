import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { nominationsAPI } from '../api/client'
import Avatar from '../components/Avatar'
import { honoree } from '../lib/honoree'

export default function AlumniOfMonth() {
  const [featured, setFeatured] = useState(null)
  const [past, setPast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    nominationsAPI.list()
      .then(data => {
        const currentMonthYear = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })
        if (data.length > 0) {
          if (data[0].month_year === currentMonthYear) {
            setFeatured(data[0])
            setPast(data.slice(1))
          } else {
            setFeatured(null)
            setPast(data)
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="page-layout"><div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>Loading...</div></div>
  }

  if (!featured) {
    return (
      <div className="page-layout">
        <div className="aom-hero">
          <div className="container">
            <h1>Alumni of the Month</h1>
            <div className="aom-hero-divider" />
          </div>
        </div>
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h3>No Alumni of the Month featured yet.</h3>
          <p style={{ marginTop: 20, color: 'var(--gray-500)' }}>Check back later or nominate someone outstanding!</p>
          <Link to="/nominate" className="btn-nominate" style={{ display: 'inline-block', marginTop: 20 }}>Submit a Nomination →</Link>
        </div>
      </div>
    )
  }

  const h = honoree(featured)

  return (
    <div className="page-layout">

      {/* Hero */}
      <div className="aom-hero">
        <div className="container">
          <div className="aom-hero-eyebrow">{h.monthYear || 'Current'} Honoree</div>
          <h1>Alumni of the Month</h1>
          <div className="aom-hero-divider" />
        </div>
      </div>

      {/* Featured */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-grid">

            <div className="featured-photo-wrap">
              <Avatar
                photoUrl={h.photoUrl}
                name={h.name}
                className="featured-photo-placeholder"
              />
              <div className="featured-photo-overlay">
                <div className="feat-overlay-name">{h.name}</div>
                <div className="feat-overlay-role">{h.subtitle}</div>
                <div className="feat-overlay-meta">
                  <span className="feat-overlay-honour">{h.honour}</span>
                  {h.company && <span>{h.company}</span>}
                </div>
              </div>
            </div>

            <div>
              <div className="feat-section-title">About the Honoree</div>
              <p className="feat-bio">{featured.reason}</p>

              {h.location && (
                <p className="feat-bio" style={{ color: 'var(--gray-500)', fontSize: '.9rem' }}>
                  Based in {h.location}
                </p>
              )}

              <div className="feat-quote-alt">
                <div className="feat-quote-mark">"</div>
                <p>"{featured.reason.length > 100 ? featured.reason.substring(0, 100) + '...' : featured.reason}"</p>
              </div>

              {h.memberId && (
                <Link to={`/members/${h.memberId}`} className="link-readmore">
                  View Full Profile →
                </Link>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Nominate CTA */}
      <section className="nominate-section">
        <div className="container">
          <div className="nominate-card">
            <h2 className="nominate-title">Know an Outstanding Alumnus?</h2>
            <p className="nominate-body">
              Help us recognize the amazing achievements of our members. Nominate a BASEGA graduate
              who is making significant strides in their career or community.
            </p>
            <Link to="/nominate" className="btn-nominate">Submit a Nomination →</Link>
          </div>
        </div>
      </section>

      {/* Past honorees */}
      {past.length > 0 && (
        <section className="past-section">
          <div className="container">
            <div className="past-head">
              <h2>Past Alumni of the Month</h2>
              <p>Recognising the excellence of our BASEGA community, month by month.</p>
            </div>
            <div className="past-grid">
              {past.map(p => {
                const ph = honoree(p)
                const card = (
                  <>
                    <Avatar photoUrl={ph.photoUrl} name={ph.name} className="past-avatar" />
                    <div className="past-name">{ph.name}</div>
                    <div className="past-role" style={{ fontSize: '0.85rem' }}>{ph.subtitle}</div>
                    <div className="past-month">{p.month_year}</div>
                  </>
                )
                return ph.memberId
                  ? <Link key={p.id} to={`/members/${ph.memberId}`} className="past-card">{card}</Link>
                  : <div key={p.id} className="past-card">{card}</div>
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
