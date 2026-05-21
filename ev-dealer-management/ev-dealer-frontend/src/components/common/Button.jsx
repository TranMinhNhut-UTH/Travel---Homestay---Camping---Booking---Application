/**
 * Reusable Button Component
 * Supports multiple variants and sizes
 */

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn'
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    danger: 'btn-danger',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    success: 'btn-success'
  }
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  }
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.medium,
    disabled ? 'btn-disabled' : '',
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button 
      className={classes}
      onClick={onClick} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner">⟳</span>}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  )
}

export default Button

