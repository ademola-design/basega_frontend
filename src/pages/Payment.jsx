import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const PAYMENT_TYPES = [
  { value: 'annual',      label: 'Annual Dues 2026',   amount: 25000 },
  { value: 'building',    label: 'Building Fund',       amount: 0 },
  { value: 'scholarship', label: 'Scholarship Fund',    amount: 0 },
  { value: 'event',       label: 'Event Sponsorship',   amount: 0 },
]

function formatNaira(n) {
  return n > 0 ? '₦ ' + n.toLocaleString() : '₦ —'
}

export default function Payment() {
  const [selected, setSelected]   = useState('annual')
  const [email, setEmail]         = useState('')
  const [status, setStatus]       = useState('idle') // idle | loading | done | error

  const currentType = PAYMENT_TYPES.find(t => t.value === selected)
  const amount      = currentType?.amount ?? 0

  function handlePay() {
    if (!email || !email.includes('@')) {
      setStatus('error')
      return
    }
    setStatus('loading')
    setTimeout(() => setStatus('done'), 2000)
  }

  return (
    <div className="page-layout">
      <PageHeader
        title="Make a Payment"
        subtitle="Securely pay your annual dues, scholarship contribution, or event registration fee"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Payment' }]}
      />

      <section className="pay-section">
        <div className="pay-card-wrap">
          <div className="pay-card">

            <div className="pay-card-header">
              <div className="pay-card-badge">BASEGA ALUMNI</div>
              <h2>Make a Payment</h2>
              <p>Select payment type and enter your details</p>
            </div>

            {status === 'done' ? (
              <div className="pay-success">
                <span className="pay-success-icon">✓</span>
                <h2>Payment Initiated!</h2>
                <p>Check your email for the next steps. Your reference will be sent to <strong>{email}</strong>.</p>
                <button className="pay-btn" onClick={() => { setStatus('idle'); setEmail('') }}>
                  Make Another Payment
                </button>
              </div>
            ) : (
              <div className="pay-card-body">
                <p className="pay-field-label">Payment For</p>
                <div className="pay-type-grid">
                  {PAYMENT_TYPES.map(t => (
                    <label
                      key={t.value}
                      className={`pay-type-option${selected === t.value ? ' selected' : ''}`}
                      onClick={() => setSelected(t.value)}
                    >
                      <input type="radio" name="pay-type" value={t.value} readOnly checked={selected === t.value} />
                      <span className="pay-type-name">{t.label}</span>
                      {t.amount > 0 && <span className="pay-type-amount">₦{t.amount.toLocaleString()}</span>}
                    </label>
                  ))}
                </div>

                <p className="pay-field-label pay-field-label--mt">Amount to Pay</p>
                <div className="pay-amount-display">{formatNaira(amount)}</div>

                <div className="pay-field-group">
                  <label className="pay-field-label" htmlFor="pay-email">Email Address</label>
                  <input
                    type="email"
                    className="pay-input"
                    id="pay-email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setStatus('idle') }}
                  />
                  <small className="pay-field-hint">Receipt will be sent to this email</small>
                  {status === 'error' && <small className="pay-field-error">Please enter a valid email address.</small>}
                </div>

                <button
                  className="pay-btn"
                  onClick={handlePay}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Processing…' : amount > 0 ? `Pay ₦${amount.toLocaleString()}` : 'Pay Now'}
                </button>

                <div className="pay-secure-note">
                  Secured by <strong>BASEGA Pay</strong>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  )
}
