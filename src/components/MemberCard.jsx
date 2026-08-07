import { Link } from 'react-router-dom'

function initials(name) {
  return name.replace(/^(Mr|Mrs|Dr|Prof|Engr|Rev)\.\s*/i, '').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function MemberCard({ member }) {
  const isFin = member.status === 'Financial'

  return (
    <div className="member-card">
      {isFin && <span className="member-bookmark" title="Financial Member">★</span>}

      <div className={`member-avatar-wrap ${isFin ? 'fin-ring' : ''}`}>
        <div className="member-avatar">
          {member.photo
            ? <img src={member.photo} alt={member.name} />
            : initials(member.name)
          }
        </div>
      </div>

      <div className="member-name">{member.name}</div>

      <div className="member-class-badge">
        Class of {member.classYear}
      </div>

      <hr className="member-divider" />

      <div className="member-detail">
        <div className="member-detail-text">
          <strong>{member.profession}</strong>
          <span>{member.location}</span>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={isFin ? 'badge-fin' : 'badge-inact'}>
          {isFin ? 'Financial' : 'Inactive'}
        </span>
        <Link to={`/members/${member.id}`} className="btn btn-outline btn-xs">
          View Profile
        </Link>
      </div>
    </div>
  )
}
