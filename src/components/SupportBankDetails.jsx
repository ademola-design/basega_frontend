import { supportBankAccounts } from '../data/bankAccounts'

export default function SupportBankDetails({ variant = 'page' }) {
  return (
    <section className={`support-bank-details support-bank-details--${variant}`} aria-labelledby={`support-bank-title-${variant}`}>
      <h2 id={`support-bank-title-${variant}`}>Support and Sponsorship</h2>
      <p>For support and sponsorship, please pay into either the Wema Bank or Zenith Bank account below.</p>
      <div className="support-bank-grid">
        {supportBankAccounts.map(account => (
          <article className="support-bank-account" key={account.bank}>
            <h3>{account.bank}</h3>
            <dl>
              <div><dt>Account name</dt><dd>{account.accountName}</dd></div>
              <div><dt>Account number</dt><dd>{account.accountNumber}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}
