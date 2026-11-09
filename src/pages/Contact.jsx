import PageHeader from '../components/PageHeader'

const contactDetails = [
  { title: 'School Address', text: 'BAPTIST SECONDARY GRAMMAR SCHOOL, AGO-ARE, Saki Road, Ago-Are, ATISBO Local Govt. Oyo State' },
  { title: 'Nigeria', text: '+234 706 771 4292', href: 'tel:+2347067714292' },
  { title: 'United Kingdom', text: '+44 7721 878890', href: 'tel:+447721878890' },
  { title: 'Email', text: 'info@basegaalumni.ng', href: 'mailto:info@basegaalumni.ng' },
  { title: 'Office Hours', text: 'Monday–Friday, 08:00–17:00 WAT' },
]

export default function Contact() {
  return (
    <div className="page-layout">
      <PageHeader
        title="Contact Us"
        eyebrow="Get in Touch"
        subtitle="Contact the BASEGA Alumni Nigeria secretariat."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info-card">
              <h2>Contact Details</h2>
              {contactDetails.map(detail => (
                <div key={detail.title} className="contact-detail">
                  <div className="contact-detail-text">
                    <h4>{detail.title}</h4>
                    <p>{detail.href ? <a href={detail.href}>{detail.text}</a> : detail.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
