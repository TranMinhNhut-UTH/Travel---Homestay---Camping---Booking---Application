/**
 * Enhanced Modal Component
 * Supports animations, backdrop click, different sizes, and better UX
 */

import { useEffect } from 'react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalClasses = [
    'modal',
    `modal-${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
    >
      <div className={modalClasses}>
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          {showCloseButton && (
            <button 
              className="modal-close" 
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

