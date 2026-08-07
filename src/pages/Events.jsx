import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { eventsAPI } from '../api/client'

export default function Events() {
  const [tab, setTab] = useState('upcoming')
  const [eventsList, setEventsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    eventsAPI.list()
      .then(data => {
        setEventsList(data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = eventsList.filter(ev => new Date(ev.event_date) >= today)
  const past = eventsList.filter(ev => new Date(ev.event_date) < today).sort((a, b) => new Date(b.event_date) - new Date(a.event_date))

  const currentEvents = tab === 'upcoming' ? upcoming : past

  return (
    <div className="page-layout">
      <PageHeader
        title="Events"
        eyebrow="What's Coming"
        subtitle="Stay up to date with BASEGA Alumni events, gatherings, and activities."
        breadcrumbs={[{ label: 'Events' }]}
      />

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">

          {/* Tab nav */}
          <div className="events-tabs">
            <button
              className={`events-tab ${tab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setTab('upcoming')}
            >
              Upcoming Events
            </button>
            <button
              className={`events-tab ${tab === 'past' ? 'active' : ''}`}
              onClick={() => setTab('past')}
            >
              Past Events
            </button>
          </div>

          {loading ? (
            <div className="text-center" style={{ padding: '80px 0' }}>
              <div className="login-spinner" style={{ width: 40, height: 40, margin: '0 auto' }} />
            </div>
          ) : currentEvents.length > 0 ? (
            currentEvents.map(ev => {
              const d = new Date(ev.event_date)
              const day = d.getDate().toString()
              const month = d.toLocaleString('en-US', { month: 'short' })
              const year = d.getFullYear().toString()

              return (
                <div key={ev.id} className={`events-card ${tab === 'past' ? 'past' : ''}`}>
                  <div className="ecard-date">
                    <div className="month">{month}</div>
                    <div className="day">{day}</div>
                    <div className="year">{year}</div>
                  </div>

                  <div className="ecard-body">
                    <div className="ecard-title">{ev.title}</div>
                    <div className="ecard-meta">
                      <span>📍 {ev.location || 'Online'}</span>
                    </div>
                    <div className="ecard-desc">{ev.description || 'Details coming soon.'}</div>
                    <div className="ecard-category">
                      <span className="badge badge-green">{ev.type || 'General'}</span>
                    </div>
                  </div>

                  <div className="ecard-actions">
                    {tab === 'upcoming' ? (
                      <>
                        <button className="btn btn-primary btn-sm">Register Now</button>
                        <button className="btn btn-outline btn-sm">Learn More</button>
                      </>
                    ) : (
                      <button className="btn btn-outline btn-sm">View Report</button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
              <p style={{ color: 'var(--gray-500)' }}>No events in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Have an Event Idea?</h2>
          <p>Suggest an event for the BASEGA Alumni community and we will help make it happen.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-white">Suggest an Event</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
