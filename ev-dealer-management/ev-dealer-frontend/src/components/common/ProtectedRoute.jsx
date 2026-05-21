/**
 * Protected Route Component
 * Route protection based on authentication and role
 * TODO: Remove development mode when backend is ready
 */

import { Navigate } from 'react-router-dom'
import authService from '../../services/authService'

const ProtectedRoute = ({ children, requiredRole }) => {
  // DEVELOPMENT MODE: Allow access without authentication
  // TODO: Remove this when backend is ready
  const isDevelopmentMode = import.meta.env.DEV
  
  if (isDevelopmentMode) {
    // Set mock user for development
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'dev-token-123')
      localStorage.setItem('user', JSON.stringify({
        id: 'dev-user-1',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'admin',
        dealerId: 'dealer1'
      }))
    }
    return children
  }

  // PRODUCTION MODE: Check authentication
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getCurrentUser()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

