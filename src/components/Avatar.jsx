import { imageUrl } from '../api/client'

/** "Dr. Ada Okonkwo" → "AO". Titles are stripped so they don't eat both slots. */
export function initialsFrom(name) {
  if (!name) return '?'
  return name
    .replace(/^(Dr|Prof|Engr|Barr|Arc|Pharm|Chief|Rev|Pastor|Alhaji|Alhaja|Mr|Mrs|Ms)\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * A member's photo, falling back to their initials.
 *
 * Takes the caller's own class so it inherits whatever size and shape that
 * context already defines (.db-avatar, .past-avatar, .featured-photo-placeholder…).
 */
export default function Avatar({ photoUrl, name, className = '', style }) {
  const src = photoUrl ? imageUrl(photoUrl) : null

  return (
    <div className={className} style={style}>
      {src
        ? <img src={src} alt={name || 'Member photo'} className="avatar-img" />
        : initialsFrom(name)}
    </div>
  )
}
