import { Link } from 'react-router-dom'

const UPDATES = [
  {
    id: 4,
    date: 'Golden Jubilee · 2026',
    title: 'Official Golden Jubilee Logo Unveiled',
    body: 'The school and its global alumni association launched the Golden Jubilee logo, kicking off countdown activities and bringing Old Basegites together worldwide.',
    tag: 'Achievement',
  },
  {
    id: 5,
    date: 'Golden Jubilee · 2026',
    title: 'Alumni-Driven Infrastructure',
    body: 'The old students’ body is supporting infrastructure improvements through fundraising and projects focused on upgrading learning facilities. Discussions are also underway about a more active role for the national old students’ body in the school’s ongoing administration.',
    tag: 'Achievement',
  },
  {
    id: 6,
    date: 'Golden Jubilee · 2026',
    title: 'Celebrating Oyo State at 50',
    body: 'As Oyo State marked its 50th anniversary, BASEGA students joined the celebrations with a road walk through Ago-Are.',
    tag: 'Achievement',
  },
  {
    id: 7,
    date: 'Golden Jubilee · 2026',
    title: 'State-Level Recognition for BASEGA Students',
    body: 'Governor Seyi Makinde presented prizes and recognition to BASEGA students for their achievements, including third place in the State Female Football Competition and a spoken-word poem titled “A Pacesetter at 50.”',
    tag: 'Achievement',
  },
  {
    id: 8,
    date: 'Recent Achievement',
    title: 'Academic Excellence',
    body: 'The school recently secured second place in a competition, continuing its strong record of achievement.',
    tag: 'Achievement',
  },
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

const MEMORABILIA = [
  {
    name: 'Anniversary Sash (Idaasa)',
    price: '₦5,000 / ₦5,500',
    detail: 'A keepsake sash for celebrating BASEGA’s Golden Jubilee.',
    mark: '50',
  },
  {
    name: 'Anniversary Towels',
    price: '₦6,000',
    detail: 'A practical Jubilee keepsake, made to remember the milestone.',
    mark: '✦',
  },
  {
    name: 'Anniversary Mugs',
    price: '₦2,500',
    detail: 'Enjoy your favourite drink with an official anniversary mug.',
    mark: 'MUG',
  },
]

const TAG_COLORS = {
  'Announcement': { bg: '#0a3d10', color: '#f1f0e8' },
  'Call to Action': { bg: '#b8860b', color: '#fff' },
  'Event': { bg: '#8b0000', color: '#fff' },
  'Achievement': { bg: '#1b6b35', color: '#fff' },
}

export default function Jubilee() {
  return (
    <div className="page-layout jubilee-page">
      <section className="jubilee-hero" aria-labelledby="jubilee-title">
        <div className="container jubilee-hero-inner">
          <nav className="about-breadcrumb jubilee-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span><span>Jubilee Anniversary</span>
          </nav>
          <div className="jubilee-hero-grid">
            <div className="jubilee-hero-copy">
              <p className="about-eyebrow"><span /> 50th Founders’ Day · Ago-Are, Oyo State</p>
              <h1 id="jubilee-title">50 years of excellence.<br /><span>A legacy still growing.</span></h1>
              <p className="jubilee-hero-lead">
                From 1976 to 2026, generations of BASEGites have carried forward a tradition
                of learning, service, peace and progress. Join us in celebrating this golden milestone.
              </p>
              <a className="about-hero-link" href="#jubilee-memorabilia">
                Explore Jubilee keepsakes <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="jubilee-hero-art">
              <div className="jubilee-logo-frame">
                <img
                  src="/photos/basega-50th.png"
                  alt="BASEGA Golden Jubilee anniversary emblem"
                  className="jubilee-logo"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
                <span>Golden Jubilee</span>
                <strong>1976 <i aria-hidden="true">—</i> 2026</strong>
              </div>
              <span className="jubilee-hero-spark jubilee-hero-spark-one" aria-hidden="true">✦</span>
              <span className="jubilee-hero-spark jubilee-hero-spark-two" aria-hidden="true">✧</span>
            </div>
          </div>
          <div className="about-stat-strip jubilee-stat-strip" aria-label="Golden Jubilee at a glance">
            <div className="about-stat"><strong>1976</strong><span>School established</span></div>
            <div className="about-stat"><strong>50</strong><span>Years of shared history</span></div>
            <div className="about-stat"><strong>2026</strong><span>Golden Jubilee year</span></div>
          </div>
        </div>
      </section>

      <section className="jubilee-memorabilia section" id="jubilee-memorabilia">
        <div className="container">
          <div className="about-section-heading jubilee-section-heading">
            <div>
              <p className="about-section-eyebrow">Official Jubilee keepsakes</p>
              <h2 className="section-title">Take a piece of the celebration home.</h2>
            </div>
            <p>Commemorate 50 years of BASEGA with anniversary memorabilia, available to purchase from the association.</p>
          </div>
          <div className="jubilee-product-grid">
            {MEMORABILIA.map((item, index) => (
              <article className="jubilee-product-card" key={item.name}>
                <div className="jubilee-product-mark" aria-hidden="true">{item.mark}</div>
                <span className="jubilee-product-index">KEEPSAKE · 0{index + 1}</span>
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
                <strong className="jubilee-product-price">{item.price}</strong>
              </article>
            ))}
          </div>
          <p className="jubilee-order-note">For availability and ordering, contact the BASEGA Alumni Association Secretariat.</p>
        </div>
      </section>

      {/* ── Updates ── */}
      <section className="jubilee-updates">
        <div className="container">
          <div className="about-section-heading jubilee-section-heading">
            <div>
              <p className="about-section-eyebrow">The celebration so far</p>
              <h2 className="section-title">Jubilee highlights &amp; updates</h2>
            </div>
            <p>Stay up to date with anniversary activities, events, and calls to action.</p>
          </div>

          <div className="jubilee-updates-list">
            {UPDATES.map(u => {
              const tagStyle = TAG_COLORS[u.tag] || { bg: '#555', color: '#fff' }
              return (
                <div key={u.id} className="jubilee-update-card">
                  {u.image && (
                    <Link to={u.link} className="jubilee-update-thumb">
                      <img src={u.image} alt={u.imageAlt} />
                    </Link>
                  )}
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
          <p className="about-section-eyebrow">A milestone made by all of us</p>
          <h2>Be part of the celebration.</h2>
          <p>Register as an alumni member and join thousands of BASEGA graduates marking this golden jubilee together.</p>
          <div className="jubilee-cta-buttons">
            <a href="/register" className="btn btn-hero-primary btn-lg">Register Now</a>
            <a href="/contact" className="btn btn-hero-outline btn-lg">Contact Secretariat</a>
          </div>
        </div>
      </section>
    </div>
  )
}
