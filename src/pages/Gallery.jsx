import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const filters = ['All', '2025', '2024', '2023', 'Reunions', 'School Events', 'Community']

const photos = [
  { id: 1, emoji: '🎓', caption: 'Annual Reunion 2025', year: '2025', cat: 'Reunions', h: 'h-240' },
  { id: 2, emoji: '🏆', caption: 'Sports Day Champions', year: '2025', cat: 'School Events', h: 'h-180' },
  { id: 3, emoji: '📚', caption: 'Scholarship Ceremony', year: '2025', cat: '2025', h: 'h-300' },
  { id: 4, emoji: '🤝', caption: 'Mentorship Workshop', year: '2025', cat: 'Community', h: 'h-180' },
  { id: 5, emoji: '🌍', caption: 'UK Chapter Launch 2024', year: '2024', cat: '2024', h: 'h-240' },
  { id: 6, emoji: '⚽', caption: 'Alumni vs Students Match', year: '2024', cat: 'School Events', h: 'h-300' },
  { id: 7, emoji: '🎭', caption: 'Cultural Day Performances', year: '2024', cat: 'School Events', h: 'h-180' },
  { id: 8, emoji: '🏗️', caption: 'Library Construction', year: '2023', cat: 'Community', h: 'h-240' },
  { id: 9, emoji: '🍽️', caption: 'Gala Dinner 2023', year: '2023', cat: 'Reunions', h: 'h-180' },
  { id: 10, emoji: '🎤', caption: 'Annual General Meeting', year: '2023', cat: '2023', h: 'h-300' },
  { id: 11, emoji: '👨‍🏫', caption: 'Class of 2005 Reunion', year: '2025', cat: 'Reunions', h: 'h-240' },
  { id: 12, emoji: '🌱', caption: 'Tree Planting Drive', year: '2024', cat: 'Community', h: 'h-180' },
]

export default function Gallery() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? photos : photos.filter(p => p.cat === active || p.year === active)

  return (
    <div className="page-layout">
      <PageHeader
        title="Photo Gallery"
        subtitle="Moments captured from BASEGA events, reunions, and school life."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="container">
          <div className="gallery-filter-row">
            {filters.map(f => (
              <button key={f} className={`gal-btn ${active === f ? 'active' : ''}`} onClick={() => setActive(f)}>
                {f}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filtered.map(photo => (
              <div key={photo.id} className="gallery-item">
                <div className={`gallery-item-ph ${photo.h}`}>
                  <span>{photo.emoji}</span>
                </div>
                <div className="gallery-overlay">
                  <p>{photo.caption}</p>
                  <span style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: 4 }}>{photo.year}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📷</div>
              <p style={{ color: 'var(--gray-500)' }}>No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Share Your Photos</h2>
          <p>Have photos from a BASEGA event? Submit them to be featured in our gallery.</p>
          <div className="cta-buttons">
            <a href="/contact" className="btn btn-white">Submit Photos</a>
          </div>
        </div>
      </section>
    </div>
  )
}
