import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import MemberCard from '../components/MemberCard'
import { membersAPI, imageUrl } from '../api/client'

const ALL_SETS = Array.from({ length: 2026 - 1981 + 1 }, (_, i) => 2026 - i)

export default function Members() {
  const [search, setSearch] = useState('')
  const [tab,    setTab]    = useState('all')   // 'all' | 'financial'
  const [setFilter, setSetFilter] = useState('')
  const [membersList, setMembersList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (setFilter) params.classSet = setFilter
    if (tab === 'financial') params.status = 'financial'

    membersAPI.list(params)
      .then(data => {
        const mapped = data.map(m => ({
          id: m.id,
          name: `${m.title ? m.title + ' ' : ''}${m.first_name} ${m.last_name}`,
          photo: m.photo_url ? imageUrl(m.photo_url) : null,
          classYear: m.class_set,
          profession: m.profession,
          location: `${m.city}, ${m.state}`,
          status: m.status === 'financial' ? 'Financial' : 'Inactive',
        }))
        setMembersList(mapped)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [search, setFilter, tab])

  // Get count of financial members from fetched list if tab is all, or count total financial members
  // For UI count, we can filter locally or just show count of current filtered
  const financialCount = tab === 'financial' ? membersList.length : membersList.filter(m => m.status === 'Financial').length

  return (
    <div className="page-layout">
      <PageHeader
        title="Alumni Directory"
        eyebrow="Our Members"
        subtitle="Connect with BASEGA graduates from across Nigeria and the diaspora."
        breadcrumbs={[{ label: 'Members' }]}
      />

      <div className="members-page">
        <div className="members-body">

          {/* Controls */}
          <div className="members-controls-card">
            <div className="members-search-row">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name or profession…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className="set-filter-select"
                value={setFilter}
                onChange={e => setSetFilter(e.target.value)}
              >
                <option value="">All Sets</option>
                {ALL_SETS.map(y => (
                  <option key={y} value={y}>Set of {y}</option>
                ))}
              </select>
            </div>
            <div className="tab-switcher">
              <button
                className={`tab-sw-btn ${tab === 'all' ? 'active' : ''}`}
                onClick={() => setTab('all')}
              >
                All Approved Members
              </button>
              <button
                className={`tab-sw-btn ${tab === 'financial' ? 'active' : ''}`}
                onClick={() => setTab('financial')}
              >
                Financial Members
              </button>
            </div>
          </div>

          <div className="result-count">
            {loading ? 'Loading alumni directory…' : (
              <>Showing <strong>{membersList.length}</strong> alumni</>
            )}
          </div>

          {loading ? (
            <div className="text-center" style={{ padding: '80px 0' }}>
              <div className="login-spinner" style={{ width: 40, height: 40, margin: '0 auto' }} />
            </div>
          ) : membersList.length > 0 ? (
            <div className="members-list">
              {membersList.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '80px 0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 12, color: 'var(--gray-400)' }}>No results</div>
              <p style={{ color: 'var(--gray-500)' }}>No alumni match your search or filter criteria.</p>
              <button
                className="btn btn-outline btn-sm mt-16"
                onClick={() => { setSearch(''); setTab('all'); setSetFilter('') }}
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="pagination-row">
            <button className="pg-btn" disabled>← Prev</button>
            <button className="pg-btn active">1</button>
            <button className="pg-btn" disabled>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
