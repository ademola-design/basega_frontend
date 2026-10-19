export const excellenceAwardsAnnouncement = {
  id: 'basega-50th-excellence-awards-nominations',
  title: 'BASEGA 50th Anniversary Excellence Awards — Call for Nominations',
  date: '6 October 2026',
  created_at: '2026-10-06T00:00:00.000Z',
  category: 'Announcements',
  excerpt: 'Nominations are invited for seven Excellence Award categories as part of BASEGA’s 50th Anniversary celebrations. Submit nominations by WhatsApp within 72 hours.',
  body: `6 October 2026

ANNOUNCEMENT

As part of activities marking the 50th Anniversary celebration of our alma mater, the Executive Committee (EC), at its meeting on Saturday, 3 October 2026, resolved, among other things, that Excellence Awards be presented to distinguished individuals, living or deceased, in the following categories:

1. Lifetime Academic Excellence Award
2. Professional Excellence Award
3. Distinguished Teachers/Staff Excellence Award
4. School (BASEGA) Development/Patron Excellence Award
5. Founding Fathers Excellence Award
6. Arts, Culture and Creative Excellence Award
7. Young Alumni Excellence Award

The videos below show the reconstruction progress of the E-Smart Multipurpose Hall.

Nominations of worthy recipients are invited. Please submit nominations by WhatsApp to 08130596058 within 72 hours of this announcement, by 9 October 2026.

Thank you.

Signed,
D.S. Olabode Esq.
Public Relations Officer`,
  video_url_1: 'https://youtu.be/SY4gtPUo_ak',
  video_url_2: 'https://youtube.com/shorts/1AlHQDA0mtg',
  nominationWhatsAppUrl: 'https://wa.me/2348130596058',
}

export function includeExcellenceAwardsAnnouncement(articles = []) {
  return [
    excellenceAwardsAnnouncement,
    ...articles.filter(article => String(article.id) !== excellenceAwardsAnnouncement.id),
  ]
}
