import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { membersAPI, imageUrl } from '../api/client'

function initials(name) {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function MemberProfile() {
  const { id } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    membersAPI.getById(id)
      .then(data => {
        const mapped = {
          id: data.id,
          name: `${data.title ? data.title + ' ' : ''}${data.first_name} ${data.last_name}`,
          photo: data.photo_url ? imageUrl(data.photo_url) : null,
          classYear: data.class_set,
          profession: data.profession,
          location: `${data.city}, ${data.state}`,
          status: data.status === 'financial' ? 'Financial' : 'Inactive',
          about: data.bio,
          email: data.email,
          phone: data.phone,
          linkedin: data.linkedin,
        }
        setMember(mapped)
      })
      .catch(err => {
        console.error(err)
        setMember(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="login-spinner" style={{ width: 40, height: 40 }} />
      </div>
    )
  }

  if (!member) {
    return (
      <div className="page-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16, color: 'var(--gray-300)' }}>—</div>
        <h2 style={{ marginBottom: 12 }}>Member Not Found</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>The profile you are looking for doesn't exist or has been removed.</p>
        <Link to="/members" className="btn btn-primary">Back to Directory</Link>
      </div>
    )
  }

  return (
    <div className="page-layout">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="container">
          <div className="profile-header-inner">
            <div className="profile-avatar-lg">
              {member.photo
                ? <img src={member.photo} alt={member.name} />
                : initials(member.name)
              }
            </div>
            <div className="profile-info">
              <h1>{member.name}</h1>
              <div className="profile-class">Class of {member.classYear} · BASEGA School</div>
              <div className="profile-tags">
                <span className="profile-tag">{member.profession}</span>
                <span className="profile-tag">{member.location}</span>
              </div>
              <div className="profile-stats-row">
                <div className="p-stat"><div className="num">{2025 - member.classYear}</div><div className="lbl">Years Since Graduation</div></div>
                <div className="p-stat"><div className="num">3</div><div className="lbl">Events Attended</div></div>
                <div className="p-stat"><div className="num">5</div><div className="lbl">Connections</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Body */}
      <div className="profile-body">
        <div className="container">
          <div className="profile-layout">
            <div className="profile-main">
              {/* About */}
              <div className="profile-card">
                <h3>About</h3>
                <p>{member.about}</p>
              </div>

              {/* Professional Background */}
              <div className="profile-card">
                <h3>Professional Background</h3>
                <div className="info-row">
                  <span className="lbl">Profession</span>
                  <span className="val">{member.profession}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Industry</span>
                  <span className="val">{member.profession}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Location</span>
                  <span className="val">{member.location}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Class Year</span>
                  <span className="val">{member.classYear}</span>
                </div>
              </div>

              {/* Activities */}
              <div className="profile-card">
                <h3>Association Activities</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                    <span style={{ color: 'var(--green-600)' }}>✓</span>
                    Attended Annual Reunion 2025
                  </li>
                  <li style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                    <span style={{ color: 'var(--green-600)' }}>✓</span>
                    Contributed to Scholarship Fund
                  </li>
                  <li style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                    <span style={{ color: 'var(--green-600)' }}>✓</span>
                    Mentor in the Alumni Mentorship Programme
                  </li>
                </ul>
              </div>
            </div>

            <div className="profile-sidebar">
              {/* Contact */}
              <div className="profile-card">
                <h3>Contact Information</h3>
                <div className="info-row">
                  <span className="lbl">Email</span>
                  <a href={`mailto:${member.email}`} style={{ color: 'var(--green-700)', fontSize: '0.88rem' }}>{member.email}</a>
                </div>
                <div className="info-row">
                  <span className="lbl">Phone</span>
                  <span className="val" style={{ fontSize: '0.88rem' }}>{member.phone}</span>
                </div>
                <button className="btn btn-primary btn-sm mt-16" style={{ width: '100%' }}>
                  Send Message
                </button>
              </div>

              {/* Membership Status */}
              <div className="profile-card">
                <h3>Membership</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                  <span className="badge badge-green">Active Member</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Member Since</span>
                  <span className="val" style={{ fontSize: '0.88rem' }}>2010</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Status</span>
                  <span className="val" style={{ fontSize: '0.88rem', color: 'var(--green-600)' }}>Paid Up</span>
                </div>
              </div>

              {/* Back */}
              <Link to="/members" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                ← Back to Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
