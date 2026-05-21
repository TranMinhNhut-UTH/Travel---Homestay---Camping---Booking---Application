/**
 * Enhanced Input Component
 * Supports validation, error states, icons, and different sizes
 */

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  size = 'medium',
  placeholder,
  required = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const inputClasses = [
    'input',
    `input-${size}`,
    error ? 'input-error' : '',
    disabled ? 'input-disabled' : '',
    icon ? `input-with-icon input-icon-${iconPosition}` : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && iconPosition === 'left' && (
          <span className="input-icon-left">{icon}</span>
        )}
        <input 
          type={type} 
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          {...props} 
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon-right">{icon}</span>
        )}
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  )
}

export default Input

