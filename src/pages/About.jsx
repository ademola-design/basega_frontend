import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const milestones = [
  { year: '1985', side: 'left',  title: 'Foundation',              desc: 'BASEGA School was founded with a vision to provide world-class education rooted in discipline, moral values, and academic excellence.' },
  { year: '1992', side: 'right', title: 'First Graduating Set',    desc: 'The pioneer set graduated with distinction, setting the standard for generations to come. 36% gained university admission.' },
  { year: '2000', side: 'left',  title: 'New Campus Expansion',    desc: 'A state-of-the-art science laboratory, library complex, and sports facilities were commissioned, transforming the learning environment.' },
  { year: '2005', side: 'right', title: 'Alumni Association Founded', desc: 'Former students officially formed the BASEGA Alumni Association to maintain bonds, give back to the school, and support current students.' },
  { year: '2012', side: 'left',  title: 'International Recognition', desc: 'BASEGA School received accreditation from the Cambridge International Examinations board, opening doors for students globally.' },
  { year: '2018', side: 'right', title: 'Scholarship Fund Launch',  desc: 'The Alumni Association launched a ₦50M scholarship endowment fund to sponsor brilliant students from underprivileged backgrounds.' },
  { year: '2024', side: 'left',  title: '₦100M Milestone',         desc: 'Combined alumni contributions surpassed ₦100 Million — funding infrastructure, scholarships, and community outreach programs.' },
]

const values = [
  { title: 'Our Mission',           desc: 'To nurture well-rounded individuals equipped with knowledge, character and the confidence to lead in a rapidly changing world.' },
  { title: 'Academic Excellence',   desc: 'We maintain rigorous academic standards, blending the Nigerian and Cambridge curricula to prepare students for both local and international success.' },
  { title: 'Community and Service', desc: 'We instil in every student a sense of responsibility to give back — to their community, and the nation at large.' },
]

const executive = [
  {
    name: 'Pharm Peter Abiodun Adedokun',
    role: 'Alumni President',
    year: 1983,
    photo: '/exec/peter-adedokun.jpg',
    bio: 'Trained Pharmacist & Independent Prescriber.',
  },
  {
    name: 'Akeem Olatunji Adesina',
    role: 'Alumni Auditor',
    year: 1984,
    photo: '/exec/akeem-adesina.jpg',
    bio: 'B.Sc, MBA, FCA, FCTI, HCIB, FCRM. Leadership roles at the Bank of Industry; Chairman, Jagun-Bioku Ventures Limited.',
  },
  {
    name: 'Ogundeji Timothy Kehinde',
    role: 'Alumni Financial Secretary',
    year: 1987,
    photo: '/exec/ogundeji-kehinde.jpg',
    bio: 'Supervisor, TESCOM Office Saki — Oyo State Post-Primary Schools Teaching Service Commission.',
  },
  {
    name: 'Gbenga Adegbiji',
    role: 'Alumni General Secretary',
    year: 1988,
    photo: '/exec/gbenga-adegbiji.jpg',
    bio: 'Digital infrastructure executive with 28+ years in IT & telecoms. CEO, Geniserve Limited.',
  },
  {
    name: 'Adedokun Mathew Adewale',
    role: 'Alumni Assistant General Secretary',
    year: 1989,
    photo: '/exec/adedokun-adewale.jpg',
    bio: 'Seasoned lecturer in Technical and Vocational Education and Training (TVET).',
  },
  {
    name: 'Dr Olubukola Sarah Ojediran',
    role: 'Alumni Welfare/Social Director',
    year: 1994,
    photo: '/exec/olubukola-ojediran.jpg',
    bio: 'Consultant Anaesthetist (FWACS).',
  },
  {
    name: 'Durodola Samson Olabode',
    role: 'Alumni Public Relations Officer',
    year: 2001,
    photo: '/exec/durodola-olabode.jpg',
    bio: 'Legal practitioner & principal partner, Durodola S. Olabode & Co. Assistant Legal Adviser, PDP Oyo State Chapter.',
  },
]

function getInitials(name) {
  return name.replace(/^(Pharm|Mr|Mrs|Dr|Prof|Barr)\.?\s*/i, '').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function About() {
  return (
    <div className="page-layout">
      <PageHeader
        title="About BASEGA School"
        eyebrow="Our Story"
        subtitle="Four decades of empowering minds, building character and shaping leaders who transform communities."
        breadcrumbs={[{ label: 'About' }]}
      />

      {/* ── Our History ── */}
      <div className="history-intro">
        <p className="eyebrow-gold">Est. 1985</p>
        <h2>Our History</h2>
        <p>
          BASEGA School was established in 1985 by a group of visionary educators who believed that every
          Nigerian child deserves access to world-class education. What began as a modest primary school with
          45 students and 6 teachers has grown into one of the most respected educational institutions in the country.
        </p>
        <p>
          Over the decades, BASEGA has expanded to include a nursery, primary, secondary, and sixth form college —
          all united by a shared commitment to academic excellence, moral integrity, and holistic development. Our
          motto, <span className="highlight-green">"Knowledge, Discipline, Service"</span> continues to guide every
          student who walks through our gates.
        </p>
        <p>
          Today, BASEGA School stands as a beacon of educational excellence, with alumni making significant
          contributions across every sector — from medicine and law to technology, the arts, and public service.
          Our graduates carry the BASEGA spirit wherever they go: a relentless pursuit of excellence and a deep
          commitment to community.
        </p>
      </div>

      {/* ── Mission & Core Values ── */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <div className="eyebrow-gold">What We Stand For</div>
            <h2 className="section-title">Mission and Core Values</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem' }}>
              The principles that guide everything we do as an association
            </p>
          </div>
          <div className="purpose-grid">
            {values.map(v => (
              <div key={v.title} className="purpose-card">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── School Achievements ── */}
      <section className="section achievements-section">
        <div className="container">
          <div className="text-center">
            <div className="eyebrow-gold">Track Record</div>
            <h2 className="section-title">School Achievements</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 0' }}>
              Decades of excellence, impact, and recognition
            </p>
          </div>
          <div className="achievements-grid">
            {[
              { title: 'Academic Excellence',  desc: 'BASEGA students have consistently dominated national science olympiads, debate competitions, and inter-school championships.' },
              { title: 'Outstanding Alumni',    desc: 'Over four decades, BASEGA has produced thousands of graduates excelling in medicine, law, engineering, business, and the arts.' },
              { title: 'Global Recognition',   desc: 'Multiple students ranked among the top performers worldwide in Cambridge International Examinations.' },
              { title: 'Scholarship Impact',   desc: 'Through the alumni scholarship fund, over 200 students have received full or partial tuition support.' },
            ].map(a => (
              <div key={a.title} className="purpose-card">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Milestones Timeline ── */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <div className="section-label">Our Journey</div>
            <h2 className="section-title">Key Milestones</h2>
          </div>
          <div className="ms-timeline">
            {milestones.map(m => (
              <div key={m.year} className={`ms-item ms-${m.side}`}>
                {m.side === 'left' ? (
                  <>
                    <div className="ms-content">
                      <div className="ms-year-tag">{m.year}</div>
                      <h3>{m.title}</h3><p>{m.desc}</p>
                    </div>
                    <div className="ms-node"><div className="ms-dot" /></div>
                    <div className="ms-spacer"><span className="ms-year">{m.year}</span></div>
                  </>
                ) : (
                  <>
                    <div className="ms-spacer"><span className="ms-year">{m.year}</span></div>
                    <div className="ms-node"><div className="ms-dot" /></div>
                    <div className="ms-content">
                      <div className="ms-year-tag">{m.year}</div>
                      <h3>{m.title}</h3><p>{m.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Association Section ── */}
      <section className="section">
        <div className="container">
          <div className="assoc-layout">
            <div>
              <div className="assoc-eyebrow">The Association</div>
              <h2 className="assoc-title">BASEGA Alumni Association</h2>
              <p className="assoc-body">
                Founded in 2005 by a passionate group of former students, the BASEGA Alumni Association exists
                to maintain the bonds forged during our school years and to channel the collective strength of
                our alumni toward meaningful impact.
              </p>
              <p className="assoc-body">
                With over <span className="assoc-highlight">5,000 registered members</span> across Nigeria and
                the diaspora, the association organises annual reunions, mentorship programs, career networking
                events, and fundraising drives for school development.
              </p>
              <p className="assoc-body">
                Our flagship initiatives include the <span className="assoc-link">Alumni Scholarship Fund</span> (which
                has awarded over 200 scholarships), the <span className="assoc-link">Annual Sports Festival</span>, and
                the <span className="assoc-link">Outstanding Alumni of the Month</span> recognition program.
              </p>
              <div className="assoc-btns">
                <Link to="/members" className="btn btn-primary">View Members →</Link>
                <Link to="/payment" className="btn btn-outline">Join / Pay Dues</Link>
              </div>
            </div>
            <div className="assoc-photo-grid">
              {['Reunions', 'Mentorship', 'Awards', 'Gallery'].map((e, i) => (
                <div key={i} className="assoc-photo">{e}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values (dark gradient bg, frosted cards) ── */}
      <section className="section values-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <div className="eyebrow-gold">What we believe</div>
            <h2 className="section-title" style={{ color: '#fff' }}>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {[
              { title: 'Excellence',    desc: 'Striving for the highest standards in all endeavours, academic and professional.' },
              { title: 'Brotherhood',   desc: 'Fostering lifelong bonds of solidarity and mutual support among all BASEGA graduates.' },
              { title: 'Service',       desc: 'Giving back to the school, community, and nation that shaped who we are.' },
            ].map(v => (
              <div key={v.title} className="value-card">
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Executive Committee ── */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <div className="eyebrow-gold">Leadership</div>
            <h2 className="section-title">Executive Committee</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 0' }}>
              Meet the dedicated alumni who volunteer their time and expertise to lead the association forward.
            </p>
          </div>
          <div className="leader-grid">
            {executive.map(e => (
              <div key={e.name} className="leader-card">
                <div className="leader-photo-wrap">
                  {e.photo
                    ? <img src={e.photo} alt={e.name} />
                    : <div className="leader-initials">{getInitials(e.name)}</div>
                  }
                </div>
                <div className="leader-card-body">
                  <div className="leader-name">{e.name}</div>
                  <div className="leader-role">{e.role}</div>
                  <div className="leader-year">Class of {e.year}</div>
                  {e.bio && <p className="leader-bio">{e.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
