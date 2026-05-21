/**
 * Reusable Footer Component
 * Can be customized for different pages
 */

import { Link } from 'react-router-dom'

const Footer = ({
  variant = 'default',
  showSocialLinks = true,
  showNewsletter = true,
  companyInfo = {},
  className = ''
}) => {
  const defaultCompanyInfo = {
    name: 'EV Dealer',
    description: 'Nền tảng quản lý đại lý xe điện hàng đầu Việt Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '+84 123 456 789',
    email: 'info@evdealer.com'
  }

  const company = { ...defaultCompanyInfo, ...companyInfo }

  const footerLinks = {
    company: [
      { label: 'Giới thiệu', path: '/about' },
      { label: 'Tin tức', path: '/news' },
      { label: 'Tuyển dụng', path: '/careers' },
      { label: 'Liên hệ', path: '/contact' }
    ],
    services: [
      { label: 'Quản lý đại lý', path: '/dealers' },
      { label: 'Quản lý xe', path: '/vehicles' },
      { label: 'Báo cáo', path: '/reports' },
      { label: 'Hỗ trợ', path: '/support' }
    ],
    legal: [
      { label: 'Điều khoản sử dụng', path: '/terms' },
      { label: 'Chính sách bảo mật', path: '/privacy' },
      { label: 'Cookie Policy', path: '/cookies' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' }
  ]

  const footerClasses = [
    'footer',
    `footer-${variant}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <footer className={footerClasses}>
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">⚡</span>
              <span className="footer-logo-text">{company.name}</span>
            </div>
            <p className="footer-description">{company.description}</p>
            
            <div className="footer-contact">
              <p>📍 {company.address}</p>
              <p>📞 {company.phone}</p>
              <p>✉️ {company.email}</p>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Công ty</h4>
            <ul className="footer-links">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Dịch vụ</h4>
            <ul className="footer-links">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Pháp lý</h4>
            <ul className="footer-links">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        {showNewsletter && (
          <div className="footer-newsletter">
            <div className="footer-newsletter-content">
              <h4>Đăng ký nhận tin</h4>
              <p>Nhận thông tin mới nhất về xe điện và công nghệ</p>
              <div className="footer-newsletter-form">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn"
                  className="footer-newsletter-input"
                />
                <button className="footer-newsletter-button">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        {showSocialLinks && (
          <div className="footer-social">
            <h4>Theo dõi chúng tôi</h4>
            <div className="footer-social-links">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  className="footer-social-link"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {company.name}. Tất cả quyền được bảo lưu.
            </p>
            <div className="footer-bottom-links">
              <Link to="/terms" className="footer-bottom-link">Điều khoản</Link>
              <Link to="/privacy" className="footer-bottom-link">Bảo mật</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

