import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, eyebrow, breadcrumbs = [] }) {
  return (
    <div className="page-header">
      <div className="container">
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {breadcrumbs.map((b, i) => (
              <span key={i}>
                <span style={{ margin: '0 4px', opacity: 0.5 }}>›</span>
                {b.to ? <Link to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow-gold" style={{ paddingTop: breadcrumbs.length ? 0 : '30px' }}>{eyebrow}</p>}
        <h1 className="text-center">{title}</h1>
        {subtitle && <p className="text-center">{subtitle}</p>}
      </div>
    </div>
  )
}
