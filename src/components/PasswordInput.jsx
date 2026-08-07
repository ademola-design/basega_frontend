import { useState, useId } from 'react'

/**
 * Password field with a show/hide toggle.
 *
 * Every password box on the site should use this, so the behaviour and the
 * toggle styling stay identical wherever one appears.
 */
export default function PasswordInput({
  value,
  onChange,
  id,
  name,
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
  className = '',
  invalid = false,
  ...rest
}) {
  const [visible, setVisible] = useState(false)
  const autoId = useId()
  const inputId = id || `pw-${autoId}`

  return (
    <div className="pw-wrap">
      <input
        id={inputId}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${className}${invalid ? ' input-error' : ''}`}
        {...rest}
      />
      <button
        type="button"
        className="pw-toggle"
        onClick={() => setVisible(v => !v)}
        // Skipped in tab order so it doesn't sit between the field and Submit.
        tabIndex={-1}
        aria-controls={inputId}
        aria-label={visible ? 'Hide password' : 'Show password'}
        title={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
