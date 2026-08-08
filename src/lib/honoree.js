/**
 * Turns a nomination row into the fields the UI shows.
 *
 * Nominations made through the member picker carry a linked member row, so the
 * name, role and photo come from live profile data — if the member updates
 * their photo, the Alumni of the Month feature follows.
 *
 * Rows created before that link existed only have the old free-text snapshot
 * ("Ada Okonkwo (Class of 1998 - Surgeon)"), so fall back to parsing it. Those
 * have no photo and render as initials.
 */
/**
 * "Alumni of the Month · August 2026" — the honour and the month it was for,
 * stated together. Falls back to the bare title on legacy rows that never
 * recorded a month.
 */
export function honourLabel(monthYear) {
  return monthYear ? `Alumni of the Month · ${monthYear}` : 'Alumni of the Month'
}

export function honoree(nom) {
  if (!nom) return null

  if (nom.nominee_member_id && nom.nominee_first_name) {
    const title = nom.nominee_title ? `${nom.nominee_title} ` : ''
    const bits = [
      nom.nominee_profession,
      nom.nominee_class_set ? `Class of ${nom.nominee_class_set}` : null,
    ].filter(Boolean)

    return {
      name:      `${title}${nom.nominee_first_name} ${nom.nominee_last_name}`,
      subtitle:  bits.join(' · ') || 'Alumnus',
      photoUrl:  nom.nominee_photo_url,
      memberId:  nom.nominee_member_id,
      company:   nom.nominee_company,
      location:  [nom.nominee_city, nom.nominee_state].filter(Boolean).join(', '),
      monthYear: nom.month_year,
      honour:    honourLabel(nom.month_year),
    }
  }

  let name = nom.nominee_name || 'Honoree'
  let subtitle = 'Alumnus'
  if (name.includes(' (')) {
    const parts = name.split(' (')
    name = parts[0]
    subtitle = parts[1].replace(')', '')
  }
  return {
    name, subtitle,
    photoUrl: null, memberId: null, company: null, location: '',
    monthYear: nom.month_year,
    honour:    honourLabel(nom.month_year),
  }
}
