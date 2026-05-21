/**
 * Reusable Header Component
 * Can be used across different pages with different configurations
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './index'

const Header = ({
  variant = 'default', // default, landing, dashboard
  showAuth = true,
  showNavigation = true,
  logo = 'EV Dealer',
  logoIcon = '⚡',
  navigationItems = [],
  user = null,
  onLogin,
  onRegister,
  onLogout,
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const defaultNavigationItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/vehicles' },
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Liên hệ', path: '/contact' }
  ]

  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavigationItems

  const handleLogin = () => {
    if (onLogin) {
      onLogin()
    } else {
      navigate('/login')
    }
  }

  const handleRegister = () => {
    if (onRegister) {
      onRegister()
    } else {
      navigate('/register')
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Default logout logic
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
    }
  }

  const headerClasses = [
    'header',
    `header-${variant}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <header className={headerClasses}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="header-logo-icon">{logoIcon}</span>
          <span className="header-logo-text">{logo}</span>
        </Link>

        {/* Desktop Navigation */}
        {showNavigation && (
          <nav className="header-nav">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path} 
                className="header-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth Section */}
        {showAuth && (
          <div className="header-auth">
            {user ? (
              <div className="header-user">
                <span className="header-user-name">{user.name}</span>
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="header-auth-buttons">
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={handleLogin}
                >
                  Đăng nhập
                </Button>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={handleRegister}
                >
                  Đăng ký
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="header-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {showNavigation && isMobileMenuOpen && (
        <div className="header-mobile-nav">
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path} 
              className="header-mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header

