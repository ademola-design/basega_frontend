import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { newsAPI, nominationsAPI } from '../api/client'
import Avatar from '../components/Avatar'
import { honoree } from '../lib/honoree'

const SLIDES = [
  { img: '/photos/school-assembly.jpg',   bgPos: 'center 40%' },
  { img: '/photos/students-pavilion.jpg', bgPos: 'center 45%' },
  { img: '/photos/students-event.jpg',    bgPos: 'center 20%' },
]

const THUMB_GRADIENTS = [
  'linear-gradient(135deg,#1B4332,#40916C)',
  'linear-gradient(135deg,#0F2419,#2D6A4F)',
  'linear-gradient(135deg,#2D6A4F,#52B788)',
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="hero-carousel">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hero-slide${i === current ? ' active' : ''}`}
        >
          <div
            className="hero-slide-img"
            style={{ backgroundImage: `url(${s.img})`, backgroundPosition: s.bgPos || 'center' }}
          />
          <div className="hero-slide-overlay" />
        </div>
      ))}
      <div className="hero-slide-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState(null)
  const [latestNews, setLatestNews] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const [current, articles] = await Promise.all([
          nominationsAPI.current(),
          newsAPI.list()
        ])
        setFeatured(current)
        setLatestNews(articles.slice(0, 3))
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
  }, [])
  return (
    <div className="page-layout">

      {/* ── Hero ── */}
      <section className="hero hero-with-carousel">
        <HeroCarousel />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <div className="hero-eyebrow">EST. 1976 · CELEBRATING 50 YEARS OF EXCELLENCE</div>
            <h1>
              BASEGA ALUMNI
              <span className="line2">ASSOCIATION</span>
            </h1>
            <p className="hero-desc">
              United in excellence. Connected for life. Join our global network of
              outstanding professionals and leaders.
            </p>
            <div className="hero-buttons">
              {/* <Link to="/payment"  className="btn btn-hero-primary btn-lg">Pay Annual Dues →</Link> */}
              <Link to="/members"  className="btn btn-hero-outline btn-lg">View Members Directory</Link>
            </div>
            <div className="hero-jubilee-badge">
              <Link to="/jubilee">50th Founders' Day — Jubilee Anniversary Updates →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <div className="stats-bar">
        <div className="container" style={{ padding: 0 }}>
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-box-num">5,240+</div>
              <div className="stat-box-lbl">Registered Alumni</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-num">15</div>
              <div className="stat-box-lbl">Active Chapters</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-num">25</div>
              <div className="stat-box-lbl">Years Active</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-num">120+</div>
              <div className="stat-box-lbl">Goals Met</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Celebrating Excellence ── */}
      <section className="excellence-section">
        <div className="container">
          {featured ? (() => {
            const h = honoree(featured)
            return (
              <>
                <div className="excellence-card">
                  <Avatar photoUrl={h.photoUrl} name={h.name} className="excellence-card-ph" />
                  <div className="excellence-card-info">
                    <div className="alumni-label">{h.honour}</div>
                    <h3>{h.name}</h3>
                    <p>{h.subtitle}</p>
                  </div>
                </div>
                <div className="excellence-inner">
                  <h2>Celebrating Excellence</h2>
                  <p>
                    Each month, we spotlight an outstanding member of the BASEGA community who
                    exemplifies our core values of excellence, integrity, and service.
                  </p>
                  <p>
                    {featured.reason.length > 150 ? featured.reason.substring(0, 150) + '...' : featured.reason}
                  </p>
                  <Link to="/alumni-of-month" className="link-readmore">
                    Read Full Story →
                  </Link>
                </div>
              </>
            )
          })() : (
            <div className="excellence-inner excellence-empty">
              <h2>Celebrating Excellence</h2>
              <p>Check back soon to see our next Alumni of the Month feature!</p>
              <Link to="/nominate" className="btn btn-outline" style={{ marginTop: 15 }}>Nominate Someone</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Updates ── */}
      <section className="updates-section">
        <div className="container">
          <div className="updates-head">
            <h2>Latest Updates</h2>
            <p>Stay informed about association news, upcoming events, and important announcements.</p>
          </div>
          <div className={`news-grid${latestNews.length === 0 ? ' news-grid-empty' : ''}`}>
            {latestNews.length > 0 ? latestNews.map((n, i) => (
              <div key={n.id} className="news-home-card">
                <div
                  className="news-home-thumb"
                  style={{ 
                    background: THUMB_GRADIENTS[i % THUMB_GRADIENTS.length],
                    backgroundImage: n.image_url ? `url(${n.image_url})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }}
                >
                  {!n.image_url && <span style={{ fontSize: '2.5rem' }}>📰</span>}
                </div>
                <div className="news-home-body">
                  <div className="news-home-date">{new Date(n.created_at).toLocaleDateString('en-GB')}</div>
                  <span className="news-home-cat">{n.category}</span>
                  <div className="news-home-title">
                    <Link to={`/news/${n.id}`}>{n.title}</Link>
                  </div>
                  <p className="news-home-excerpt">{n.excerpt ? (n.excerpt.length > 80 ? n.excerpt.substring(0, 80) + '...' : n.excerpt) : ''}</p>
                </div>
              </div>
            )) : <p className="news-empty-message">No news published yet.</p>}
          </div>
          <div className="updates-footer">
            <Link to="/news" className="btn btn-outline">View All News</Link>
          </div>
        </div>
      </section>

      {/* ── Financial Member CTA ── */}
      {/* <section className="financial-cta">
        <div className="container">
          <h2>Are you a Financial Member?</h2>
          <p>
            Your annual dues power our initiatives, scholarships, and events. Ensure
            your status is active to enjoy full membership benefits and voting rights.
          </p>
          <Link to="/payment" className="btn-gold-cta">Pay 2026 Dues Now (₦25,000)</Link>
        </div>
      </section> */}

    </div>
  )
}
