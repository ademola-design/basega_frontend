import PageHeader from '../components/PageHeader'

export default function Payment() {
  return (
    <div className="page-layout">
      <PageHeader
        title="Payment Information"
        subtitle="Online payments are temporarily unavailable. Please use the bank transfer details below."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Payment' }]}
      />

      <section className="pay-section">
        <div className="pay-card-wrap">
          <div className="pay-card">
            <div className="pay-card-header">
              <div className="pay-card-badge">BASEGA ALUMNI</div>
              <h2>Online payments are unavailable</h2>
              <p>We are not accepting payments through the website at this time.</p>
            </div>
            <div className="pay-card-body">
              <p className="payment-unavailable-message">
                To pay annual alumni dues, please make a bank transfer to the First Bank account shown alongside.
              </p>
            </div>
          </div>

          <section className="bank-accounts" aria-labelledby="bank-accounts-title">
            <h2 id="bank-accounts-title">Bank Transfer Details</h2>
            <p className="bank-accounts-intro">
              Use the First Bank account for annual alumni dues. The Wema and Zenith accounts are the other BASEGA school accounts.
            </p>
            <div className="bank-accounts-grid">
              <article className="bank-account bank-account-primary">
                <span className="bank-account-purpose">Annual Alumni Dues</span>
                <h3>First Bank (FBN)</h3>
                <dl>
                  <div><dt>Account name</dt><dd>Old Students Association Basega</dd></div>
                  <div><dt>Account number</dt><dd>2023532281</dd></div>
                </dl>
              </article>
              <article className="bank-account">
                <span className="bank-account-purpose">Other BASEGA School Account</span>
                <h3>Wema Bank</h3>
                <dl>
                  <div><dt>Account name</dt><dd>Old Student’s Association BASEGA</dd></div>
                  <div><dt>Account number</dt><dd>0447485219</dd></div>
                </dl>
              </article>
              <article className="bank-account">
                <span className="bank-account-purpose">Other BASEGA School Account</span>
                <h3>Zenith Bank</h3>
                <dl>
                  <div><dt>Account name</dt><dd>BASEGA Alumni Association</dd></div>
                  <div><dt>Account number</dt><dd>1312046537</dd></div>
                </dl>
              </article>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
