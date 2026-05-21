/**
 * Layout Components
 * Reusable layout wrappers for different page types
 */

import { Header, Footer } from './index'

// Main Layout for authenticated pages
const MainLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  headerProps = {},
  footerProps = {},
  className = ''
}) => {
  return (
    <div className={`main-layout ${className}`}>
      {showHeader && <Header {...headerProps} />}
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer {...footerProps} />}
    </div>
  )
}

// Auth Layout for login/register pages
const AuthLayout = ({
  children,
  title,
  subtitle,
  showHeader = true,
  className = ''
}) => {
  return (
    <div className={`auth-layout ${className}`}>
      {showHeader && (
        <Header 
          variant="landing"
          showNavigation={false}
          showAuth={false}
        />
      )}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
          <div className="auth-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Landing Layout for marketing pages
const LandingLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  headerProps = {},
  footerProps = {},
  className = ''
}) => {
  return (
    <div className={`landing-layout ${className}`}>
      {showHeader && <Header variant="landing" {...headerProps} />}
      <main className="landing-content">
        {children}
      </main>
      {showFooter && <Footer {...footerProps} />}
    </div>
  )
}

// Dashboard Layout for admin pages
const DashboardLayout = ({
  children,
  sidebar,
  showHeader = true,
  showFooter = false,
  headerProps = {},
  className = ''
}) => {
  return (
    <div className={`dashboard-layout ${className}`}>
      {sidebar && (
        <aside className="dashboard-sidebar">
          {sidebar}
        </aside>
      )}
      <div className="dashboard-main">
        {showHeader && <Header variant="dashboard" {...headerProps} />}
        <main className="dashboard-content">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

// Full Width Layout
const FullWidthLayout = ({
  children,
  className = ''
}) => {
  return (
    <div className={`full-width-layout ${className}`}>
      {children}
    </div>
  )
}

// Container Layout
const ContainerLayout = ({
  children,
  maxWidth = 'container',
  padding = 'medium',
  className = ''
}) => {
  const containerClasses = [
    'container-layout',
    `container-${maxWidth}`,
    `container-padding-${padding}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
}

// Grid Layout
const GridLayout = ({
  children,
  columns = 1,
  gap = 'medium',
  responsive = true,
  className = ''
}) => {
  const gridClasses = [
    'grid-layout',
    `grid-${columns}`,
    `grid-gap-${gap}`,
    responsive ? 'grid-responsive' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Flex Layout
const FlexLayout = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'medium',
  className = ''
}) => {
  const flexClasses = [
    'flex-layout',
    `flex-${direction}`,
    `flex-justify-${justify}`,
    `flex-align-${align}`,
    wrap ? 'flex-wrap' : '',
    `flex-gap-${gap}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={flexClasses}>
      {children}
    </div>
  )
}

export {
  MainLayout,
  AuthLayout,
  LandingLayout,
  DashboardLayout,
  FullWidthLayout,
  ContainerLayout,
  GridLayout,
  FlexLayout
}

