import PageHeader from '../components/PageHeader'

const UPDATES = [
  {
    id: 1,
    date: 'June 2026',
    title: '50th Founders\' Day Planning Committee Constituted',
    body: 'The BASEGA Alumni Association has constituted a planning committee to coordinate all activities for the grand 50th Founders\' Day Anniversary celebration. Members are encouraged to indicate their interest in participating.',
    tag: 'Announcement',
  },
  {
    id: 2,
    date: 'July 2026',
    title: 'Call for Memorabilia & Old Photographs',
    body: 'We are collecting old photographs, memorabilia, and stories from alumni across all sets to be featured in the anniversary commemorative booklet. Please submit your contributions to the secretariat.',
    tag: 'Call to Action',
  },
  {
    id: 3,
    date: 'August 2026',
    title: 'Anniversary Gala Night — Save the Date',
    body: 'A Gala Night dinner and awards ceremony will be held to celebrate 50 years of BASEGA\'s legacy. Outstanding alumni across various fields will be honoured. Venue and date TBC — watch this space.',
    tag: 'Event',
  },
]

const TAG_COLORS = {
  'Announcement': { bg: '#0a3d10', color: '#f1f0e8' },
  'Call to Action': { bg: '#b8860b', color: '#fff' },
  'Event': { bg: '#8b0000', color: '#fff' },
}

export default function Jubilee() {
  return (
    <div className="page-layout">
      <PageHeader
        title="Jubilee Anniversary"
        eyebrow="50th Founders' Day"
        subtitle="Celebrating 50 years of excellence, peace and progress at BASEGA Secondary School, Ago-Are."
        breadcrumbs={[{ label: 'Jubilee Anniversary' }]}
      />

      {/* ── Logo Banner ── */}
      <section className="jubilee-banner">
        <div className="container">
          <div className="jubilee-banner-inner">
            <img
              src="/photos/basega-50th.png"
              alt="BASEGA 50th Anniversary"
              className="jubilee-logo"
              onError={e => { e.target.style.display = 'none' }}
            />
            <div className="jubilee-banner-text">
              <div className="jubilee-eyebrow">BSGS · Ago-Are · Est. 1976</div>
              <h2>50 Years of Excellence</h2>
              <p>
                From 1976 to 2026 — half a century of shaping outstanding citizens, nurturing
                talent, and building a community bound by the values of <strong>Peace</strong> and <strong>Progress</strong>.
                The BASEGA Alumni Association joins the school in celebrating this historic milestone.
              </p>
              <div className="jubilee-countdown-label">Founders' Day Celebration · 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Updates ── */}
      <section className="jubilee-updates">
        <div className="container">
          <div className="jubilee-section-head">
            <h2>Anniversary Updates</h2>
            <p>Stay up to date with all 50th anniversary activities, events, and calls to action.</p>
          </div>

          <div className="jubilee-updates-list">
            {UPDATES.map(u => {
              const tagStyle = TAG_COLORS[u.tag] || { bg: '#555', color: '#fff' }
              return (
                <div key={u.id} className="jubilee-update-card">
                  <div className="jubilee-update-left">
                    <div className="jubilee-update-date">{u.date}</div>
                    <span
                      className="jubilee-update-tag"
                      style={{ background: tagStyle.bg, color: tagStyle.color }}
                    >
                      {u.tag}
                    </span>
                  </div>
                  <div className="jubilee-update-body">
                    <h3>{u.title}</h3>
                    <p>{u.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="jubilee-cta">
        <div className="container">
          <h2>Be Part of the Celebration</h2>
          <p>Register as an alumni member and join thousands of BASEGA graduates marking this golden jubilee together.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <a href="/register" className="btn btn-hero-primary btn-lg">Register Now</a>
            <a href="/contact"  className="btn btn-hero-outline btn-lg">Contact Secretariat</a>
          </div>
        </div>
      </section>
    </div>
  )
}
