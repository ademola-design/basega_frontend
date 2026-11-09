import { Link } from 'react-router-dom'
import { historySections } from '../data/history'
import presidentPhoto from '../../Alumni President.jpeg'

const values = [
  { title: 'Our Mission', desc: 'To nurture well-rounded individuals equipped with knowledge, character and the confidence to lead in a rapidly changing world.' },
  { title: 'Academic Excellence', desc: 'We maintain rigorous academic standards, blending the Nigerian and Cambridge curricula to prepare students for both local and international success.' },
  { title: 'Community and Service', desc: 'We instil in every student a sense of responsibility to give back — to their community, and the nation at large.' },
]

const president = {
  name: 'Pharm Peter Abiodun Adedokun',
  year: 1983,
}

const executive = [
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
    <div className="page-layout about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="container about-hero-inner">
          <nav className="about-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span><span>About</span>
          </nav>
          <div className="about-hero-grid">
            <div className="about-hero-copy">
              <p className="about-eyebrow"><span /> Our story · Ago-Are, Oyo State</p>
              <h1 id="about-title">A legacy of learning.<br /><span>A future of possibility.</span></h1>
              <p className="about-hero-lead">
                Since 1976, Baptist Secondary Grammar School, Ago-Are has helped generations
                of students grow in knowledge, character, and service.
              </p>
              <a className="about-hero-link" href="#about-history">
                Discover our history <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="about-hero-art" aria-label="BASEGA was established in 1976">
              <div className="about-hero-orbit about-hero-orbit-one" />
              <div className="about-hero-orbit about-hero-orbit-two" />
              <div className="about-hero-seal">
                <span>ESTABLISHED</span>
                <img src="/basega-crest.png" alt="BASEGA school crest" />
                <strong>1976</strong>
                <small>AGO-ARE · NIGERIA</small>
              </div>
              <span className="about-hero-spark about-hero-spark-one" aria-hidden="true">✦</span>
              <span className="about-hero-spark about-hero-spark-two" aria-hidden="true">✧</span>
            </div>
          </div>
          <div className="about-stat-strip" aria-label="BASEGA at a glance">
            <div className="about-stat">
              <strong>1976</strong><span>Year established</span>
            </div>
            <div className="about-stat">
              <strong>108</strong><span>Students in the first intake</span>
            </div>
            <div className="about-stat">
              <strong>3</strong><span>Form One classes at the start</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Core Values ── */}
      <section className="section about-info-section">
        <div className="container">
          <div className="about-section-heading">
            <div>
              <p className="about-section-eyebrow">The foundation</p>
              <h2 className="section-title">What we stand for</h2>
            </div>
            <p>
              The principles that shape the BASEGA experience and guide the people who carry
              its legacy forward.
            </p>
          </div>
          <div className="purpose-grid">
            {values.map((v, index) => (
              <article key={v.title} className="purpose-card about-purpose-card">
                <span className="about-card-index">0{index + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── School Achievements ── */}
      <section className="section achievements-section about-achievements">
        <div className="container">
          <div className="about-section-heading about-section-heading-light">
            <div>
              <p className="about-section-eyebrow">A tradition of distinction</p>
              <h2 className="section-title">Excellence in action</h2>
            </div>
            <p>
              A proud record of achievement built by generations of students, educators, and
              alumni.
            </p>
          </div>
          <div className="achievements-grid">
            {[
              { title: 'Academic Excellence', desc: 'BASEGA students have consistently dominated national science olympiads, debate competitions, and inter-school championships.' },
              { title: 'Outstanding Alumni', desc: 'Over four decades, BASEGA has produced thousands of graduates excelling in medicine, law, engineering, business, and the arts.' },
              { title: 'Global Recognition', desc: 'Multiple students ranked among the top performers worldwide in Cambridge International Examinations.' },
            ].map(a => (
              <article key={a.title} className="purpose-card about-achievement-card">
                <span aria-hidden="true">✦</span>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our History ── */}
      <section className="section about-history-section" id="about-history">
        <div className="container">
          <div className="about-history-heading">
            <div>
              <p className="about-section-eyebrow">The story so far</p>
              <h2 className="section-title">Rooted in community.<br />Growing through generations.</h2>
            </div>
            <p>
              From a community’s need for secondary education grew a school whose story is
              shaped by dedicated teachers, curious students, and a lasting sense of belonging.
            </p>
          </div>
          <div className="history-content">
            {historySections.map((section, index) => (
              <article className="history-section" key={section.title}>
                <div className="history-section-marker" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="history-section-body">
                  <h3>{section.title}</h3>
                  {section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                  {section.subsections?.map(subsection => (
                    <div className="history-subsection" key={subsection.title}>
                      <h4>{subsection.title}</h4>
                      {subsection.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                      {subsection.items && (
                        <ul>
                          {subsection.items.map(item => <li key={item}>{item}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Association Section ── */}
      <section className="section about-association">
        <div className="container">
          <div className="assoc-layout">
            <div>
              <div className="assoc-eyebrow">The people behind the legacy</div>
              <h2 className="assoc-title">BASEGA Alumni Association</h2>
              <p className="assoc-body">
                The BASEGA Old Students Association was first formed in 1983 and formally organised in 1985.
                It brings former students together to maintain the bonds forged during our school years and
                channel the collective strength of our alumni toward meaningful impact.
              </p>
              <p className="assoc-body">
                With over <span className="assoc-highlight">2,000 registered members</span> at present across Nigeria and
                the diaspora, the association organises annual reunions, mentorship programs, career networking
                events, and fundraising drives for school development.
              </p>
              <p className="assoc-body">
                Our flagship initiatives include the <span className="assoc-link">Annual Sports Festival</span> and
                the <span className="assoc-link">Outstanding Alumni of the Month</span> recognition program.
              </p>
              <div className="assoc-btns">
                <Link to="/members" className="btn btn-primary">View Members →</Link>
                <Link to="/payment" className="btn btn-outline">Join / Pay Dues</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values (dark gradient bg, frosted cards) ── */}
      <section className="section values-section about-values">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <div className="eyebrow-gold">What we believe</div>
            <h2 className="section-title" style={{ color: '#fff' }}>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {[
              { title: 'Excellence', desc: 'Striving for the highest standards in all endeavours, academic and professional.' },
              { title: 'Brotherhood', desc: 'Fostering lifelong bonds of solidarity and mutual support among all BASEGA graduates.' },
              { title: 'Service', desc: 'Giving back to the school, community, and nation that shaped who we are.' },
            ].map(v => (
              <div key={v.title} className="value-card">
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="president-section about-president-section" aria-labelledby="president-name">
        <div className="container">
          <article className="president-feature">
            <div className="president-portrait">
              <img src={presidentPhoto} alt={`Portrait of ${president.name}`} />
              <span className="president-set-badge">BASEGA · CLASS OF {president.year}</span>
            </div>
            <div className="president-content">
              <div className="president-eyebrow">
                <span className="president-eyebrow-mark" aria-hidden="true" />
                Meet our Alumni President
              </div>
              <h2 id="president-name">{president.name}</h2>
              <div className="president-credentials" aria-label="Professional credentials">
                <span>MPSN</span>
                <span>MRPhS</span>
              </div>

              <div className="president-bio">
                <p>
                  Peter trained and qualified as a pharmacist at the University of Lagos in 1989.
                  He completed his internship at May &amp; Baker Nigeria PLC and served as a corps
                  pharmacist at NITEL Health Centre, Ikoyi, Lagos.
                </p>
                <p>
                  He began his career as a registered pharmacist at NAFDAC before joining the
                  Federal Ministry of Sports in Abuja, where he rose to Principal Pharmacist. In
                  2002, he travelled abroad to further his career.
                </p>
              </div>

              <div className="president-career">
                <div className="president-career-item">
                  <span>2005</span>
                  <p>Qualified and registered as a pharmacist in the United Kingdom</p>
                </div>
                <div className="president-career-item">
                  <span>2018</span>
                  <p>Became an Independent Prescriber</p>
                </div>
              </div>

              <p className="president-bio president-bio-last">
                His extensive UK experience spans community, secure-setting, hospital and general
                practice pharmacies.
              </p>

              <div className="president-current-role">
                <span>Healthcare leadership</span>
                <p>
                  He serves as Chairman of Pabidok Ventures Limited, a healthcare solutions
                  company whose subsidiary is Villa Pharmacy and Supermarket.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── Executive Committee ── */}
      <section className="section about-executives">
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
