/**
 * Badge Component
 * For displaying status indicators, counts, and labels
 */

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  count,
  maxCount = 99,
  showZero = false,
  className = '',
  ...props
}) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    dot ? 'badge-dot' : '',
    className
  ].filter(Boolean).join(' ')

  const displayCount = () => {
    if (count === undefined || count === null) return null
    if (count === 0 && !showZero) return null
    return count > maxCount ? `${maxCount}+` : count
  }

  if (dot) {
    return (
      <span className={badgeClasses} {...props}>
        <span className="badge-dot-inner"></span>
      </span>
    )
  }

  return (
    <span className={badgeClasses} {...props}>
      {count !== undefined ? displayCount() : children}
    </span>
  )
}

// Status Badge Component
export const StatusBadge = ({ 
  status, 
  size = 'medium',
  className = '' 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: { variant: 'success', label: 'Active' },
      inactive: { variant: 'secondary', label: 'Inactive' },
      pending: { variant: 'warning', label: 'Pending' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'danger', label: 'Rejected' },
      draft: { variant: 'secondary', label: 'Draft' },
      published: { variant: 'success', label: 'Published' },
      archived: { variant: 'secondary', label: 'Archived' },
      online: { variant: 'success', label: 'Online' },
      offline: { variant: 'danger', label: 'Offline' },
      available: { variant: 'success', label: 'Available' },
      sold: { variant: 'secondary', label: 'Sold' },
      reserved: { variant: 'warning', label: 'Reserved' }
    }
    
    return configs[status?.toLowerCase()] || { 
      variant: 'default', 
      label: status || 'Unknown' 
    }
  }

  const config = getStatusConfig(status)
  
  return (
    <Badge 
      variant={config.variant} 
      size={size}
      className={className}
    >
      {config.label}
    </Badge>
  )
}

// Notification Badge Component
export const NotificationBadge = ({ 
  count = 0, 
  maxCount = 99,
  showZero = false,
  size = 'small',
  className = ''
}) => {
  return (
    <Badge 
      variant="danger" 
      count={count}
      maxCount={maxCount}
      showZero={showZero}
      size={size}
      className={`notification-badge ${className}`}
    />
  )
}

// Progress Badge Component
export const ProgressBadge = ({ 
  value, 
  max = 100,
  showPercentage = true,
  size = 'medium',
  className = ''
}) => {
  const percentage = Math.round((value / max) * 100)
  
  const getVariant = () => {
    if (percentage >= 80) return 'success'
    if (percentage >= 60) return 'warning'
    return 'danger'
  }

  return (
    <Badge 
      variant={getVariant()} 
      size={size}
      className={`progress-badge ${className}`}
    >
      {showPercentage ? `${percentage}%` : `${value}/${max}`}
    </Badge>
  )
}

export default Badge
