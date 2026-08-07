import { useState, useEffect, useRef } from 'react'
import { membersAPI } from '../api/client'
import Avatar from './Avatar'

/**
 * Search-and-select over the approved member directory.
 *
 * Nominations attach to a real member id rather than a typed name, which is
 * what lets the Alumni of the Month feature show the honoree's own profile
 * photo and keep it in sync with their profile.
 */
export default function MemberPicker({ value, onChange, invalid, excludeId }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const boxRef = useRef(null)

  // Debounced directory search.
  useEffect(() => {
    const q = query.trim()
    if (value || q.length < 2) { setResults([]); return }

    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      membersAPI.list({ search: q })
        .then(rows => {
          if (cancelled) return
          setResults(rows.filter(r => r.id !== excludeId).slice(0, 8))
          setError('')
          setOpen(true)
        })
        .catch(() => { if (!cancelled) setError('Could not search the directory.') })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 300)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [query, value, excludeId])

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function pick(member) {
    onChange(member)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  if (value) {
    return (
      <div className="mp-selected">
        <Avatar photoUrl={value.photo_url} name={`${value.first_name} ${value.last_name}`} className="mp-selected-avatar" />
        <div className="mp-selected-info">
          <div className="mp-selected-name">
            {value.title ? value.title + ' ' : ''}{value.first_name} {value.last_name}
          </div>
          <div className="mp-selected-meta">
            {[value.profession, value.class_set ? `Class of ${value.class_set}` : null]
              .filter(Boolean).join(' · ') || 'BASEGA Alumnus'}
          </div>
        </div>
        <button type="button" className="mp-clear" onClick={() => onChange(null)}>
          Change
        </button>
      </div>
    )
  }

  return (
    <div className="mp-wrap" ref={boxRef}>
      <input
        className={`form-control${invalid ? ' input-error' : ''}`}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        placeholder="Start typing a member's name…"
        autoComplete="off"
      />

      {open && (
        <div className="mp-dropdown">
          {loading && <div className="mp-empty">Searching…</div>}
          {!loading && error && <div className="mp-empty">{error}</div>}
          {!loading && !error && results.length === 0 && (
            <div className="mp-empty">
              No approved member matches that name.
            </div>
          )}
          {!loading && results.map(m => (
            <button type="button" key={m.id} className="mp-option" onClick={() => pick(m)}>
              <Avatar photoUrl={m.photo_url} name={`${m.first_name} ${m.last_name}`} className="mp-option-avatar" />
              <span className="mp-option-text">
                <span className="mp-option-name">{m.first_name} {m.last_name}</span>
                <span className="mp-option-meta">
                  {[m.profession, m.class_set ? `Class of ${m.class_set}` : null].filter(Boolean).join(' · ')}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="form-hint">
        Only registered, approved members can be nominated — that is how we show their profile photo.
      </div>
    </div>
  )
}
