import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function getInitials(name) {
  return name.replace(/^(Mr|Mrs|Dr|Prof|Barr|Engr|Rev)\.\s*/i, '').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const executive = [
  { name: 'Barr. Olumide Ajayi',  role: 'President',           year: 1995 },
  { name: 'Dr. Funke Adeyemi',    role: 'Vice President',      year: 1998 },
  { name: 'Mr. Emeka Obiora',     role: 'General Secretary',   year: 2001 },
  { name: 'Mrs. Halima Bello',    role: 'Financial Secretary', year: 2000 },
]

const committees = [
  { name: 'Finance Committee',   chair: 'Tokunbo Adekiss',        members: ['Babatunde Festus', 'Emeka Nnamdi', 'Adebayo Johnson'],       icon: '💰', desc: 'Oversees financial planning, dues collection, and investment of association funds.' },
  { name: 'Education Committee', chair: 'Zainab Usman',           members: ['Alana Belle', 'Dandola Ogundiyan'],                          icon: '🎓', desc: 'Manages the scholarship programme and alumni mentorship initiatives.' },
  { name: 'Health Committee',    chair: 'Dr. Titilawale Adekiya', members: ['Fatima Ibrahim', 'Kabiru Abubakar'],                         icon: '🏥', desc: 'Coordinates free medical outreach and health advocacy for BASEGA communities.' },
  { name: 'ICT Committee',       chair: 'Adebayo Johnson',        members: ['Dandola Ogundiyan', 'Alana Belle'],                          icon: '💻', desc: "Drives the association's digital transformation and online presence." },
  { name: 'Community Committee', chair: 'Oluwaseun Peters',       members: ['Babatunde Festus', 'Ngozi Eze'],                             icon: '🤝', desc: 'Leads community service initiatives and environmental projects nationwide.' },
  { name: 'Sports Committee',    chair: 'Tokunbo Adekiss',        members: ['Emeka Nnamdi', 'Adebayo Johnson', 'Kabiru Abubakar'],        icon: '⚽', desc: 'Organises annual sports tournaments and wellness programmes for alumni.' },
]

export default function Committees() {
  return (
    <div className="page-layout">
      <PageHeader
        title="Committees"
        eyebrow="Leadership"
        subtitle="Executive leadership and sub-committee structure for the 2025–2027 term across Nigeria"
        breadcrumbs={[{ label: 'Committees' }]}
      />

      {/* Executive Committee */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="text-center">
            <div className="eyebrow-gold">Elected Leadership</div>
            <h2 className="section-title">Executive Committee</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
              Elected at the 2025 Annual General Meeting, Transcorp Hilton, Abuja — serving until 2027
            </p>
          </div>

          <div className="exec-grid">
            {executive.map(e => (
              <div key={e.name} className="exec-card">
                <div className="exec-card-banner" />
                <div className="exec-card-body">
                  <div className="exec-avatar">{getInitials(e.name)}</div>
                  <div className="exec-name">{e.name}</div>
                  <div className="exec-role">{e.role}</div>
                  <div className="exec-year">Class of {e.year}</div>
                  <Link to="/members" className="btn btn-outline btn-sm btn-profile">View Profile</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Committees */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="text-center">
            <div className="eyebrow-gold">Working Groups</div>
            <h2 className="section-title">Sub-Committees</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
              Specialised committees driving focused work in key areas of BASEGA's mandate
            </p>
          </div>

          <div className="committees-grid">
            {committees.map(c => (
              <div key={c.name} className="committee-card">
                <div className="committee-head">
                  <span className="committee-icon">{c.icon}</span>
                  <h3>{c.name}</h3>
                </div>
                <div className="committee-body">
                  <div className="committee-chair">
                    <div className="avatar avatar-sm">{getInitials(c.chair)}</div>
                    <div>
                      <div className="lbl">Chairperson</div>
                      <div className="nm">{c.chair}</div>
                    </div>
                  </div>
                  <div className="committee-section-lbl">Members</div>
                  <div className="member-pills">
                    {c.members.map(m => (
                      <span key={m} className="member-pill">
                        <div className="avatar avatar-pill">{getInitials(m)}</div>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Interested in Joining a Committee?</h2>
          <p>Committees are open to all registered alumni in good standing across Nigeria. Contact the secretariat to express your interest.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-white">Contact the Secretariat</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
