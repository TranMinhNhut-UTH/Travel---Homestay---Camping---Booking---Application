/**
 * Sidebar Navigation Component
 * TODO: Implement sidebar with menu items, icons, active state
 * Menu items: Dashboard, Vehicles, Sales, Customers, Dealers, Reports, Notifications, Settings
 */

import { Link } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/vehicles', label: 'Vehicles', icon: '🚗' },
    { path: '/sales', label: 'Sales', icon: '💰' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/dealers', label: 'Dealers', icon: '🏢' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>EV Dealer</h2>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className="menu-item">
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

