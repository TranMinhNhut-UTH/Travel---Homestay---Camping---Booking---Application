/**
 * Toast Notification Component
 * Supports different types, auto-dismiss, and positioning
 */

import { useState, useEffect } from 'react'

const Toast = ({
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  onClose,
  show = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(show)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsLeaving(false)
    } else {
      setIsLeaving(true)
      setTimeout(() => setIsVisible(false), 300) // Animation duration
    }
  }, [show])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  const toastClasses = [
    'toast',
    `toast-${type}`,
    `toast-${position}`,
    isLeaving ? 'toast-leaving' : '',
    className
  ].filter(Boolean).join(' ')

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
      default: return 'ℹ'
    }
  }

  return (
    <div className={toastClasses}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// Toast Container Component
export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id || index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          show={toast.show !== false}
          onClose={() => onRemove?.(toast.id || index)}
          className={toast.className}
        />
      ))}
    </div>
  )
}

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      show: true,
      duration: 5000,
      position: 'top-right',
      type: 'info',
      ...toast
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message, options = {}) => 
    addToast({ message, type: 'success', ...options })
  
  const error = (message, options = {}) => 
    addToast({ message, type: 'error', ...options })
  
  const warning = (message, options = {}) => 
    addToast({ message, type: 'warning', ...options })
  
  const info = (message, options = {}) => 
    addToast({ message, type: 'info', ...options })

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

export default Toast
