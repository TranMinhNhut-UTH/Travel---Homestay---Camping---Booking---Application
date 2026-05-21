/**
 * Reusable Hero Section Component
 * Can be used for landing pages, product pages, etc.
 */

import { Button } from './index'

const Hero = ({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundVideo,
  overlay = true,
  overlayOpacity = 0.5,
  textAlign = 'center',
  showButtons = true,
  primaryButton = { text: 'Khám phá ngay', onClick: () => {} },
  secondaryButton = { text: 'Tìm hiểu thêm', onClick: () => {} },
  features = [],
  className = ''
}) => {
  const heroClasses = [
    'hero',
    `hero-${textAlign}`,
    className
  ].filter(Boolean).join(' ')

  const heroStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }

  return (
    <section className={heroClasses} style={heroStyle}>
      {/* Background Video */}
      {backgroundVideo && (
        <video 
          className="hero-video"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {overlay && (
        <div 
          className="hero-overlay"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="hero-container">
        <div className="hero-content">
          {subtitle && (
            <p className="hero-subtitle">{subtitle}</p>
          )}
          
          {title && (
            <h1 className="hero-title">{title}</h1>
          )}
          
          {description && (
            <p className="hero-description">{description}</p>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <ul className="hero-features">
              {features.map((feature, index) => (
                <li key={index} className="hero-feature">
                  <span className="hero-feature-icon">{feature.icon}</span>
                  <span className="hero-feature-text">{feature.text}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Action Buttons */}
          {showButtons && (
            <div className="hero-actions">
              {primaryButton && (
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={primaryButton.onClick}
                  className="hero-primary-button"
                >
                  {primaryButton.text}
                </Button>
              )}
              
              {secondaryButton && (
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={secondaryButton.onClick}
                  className="hero-secondary-button"
                >
                  {secondaryButton.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <div className="hero-scroll-arrow">↓</div>
        <span>Cuộn để khám phá</span>
      </div>
    </section>
  )
}

// Product Hero Component
export const ProductHero = ({
  productName,
  productTagline,
  productImage,
  price,
  features = [],
  onBuyNow,
  onLearnMore,
  className = ''
}) => {
  return (
    <Hero
      title={productName}
      subtitle="Sản phẩm mới"
      description={productTagline}
      backgroundImage={productImage}
      features={features}
      primaryButton={{
        text: `Mua ngay - ${price}`,
        onClick: onBuyNow
      }}
      secondaryButton={{
        text: 'Tìm hiểu thêm',
        onClick: onLearnMore
      }}
      className={`product-hero ${className}`}
    />
  )
}

// Service Hero Component
export const ServiceHero = ({
  serviceName,
  serviceDescription,
  serviceImage,
  benefits = [],
  onGetStarted,
  onContact,
  className = ''
}) => {
  return (
    <Hero
      title={serviceName}
      description={serviceDescription}
      backgroundImage={serviceImage}
      features={benefits}
      primaryButton={{
        text: 'Bắt đầu ngay',
        onClick: onGetStarted
      }}
      secondaryButton={{
        text: 'Liên hệ tư vấn',
        onClick: onContact
      }}
      className={`service-hero ${className}`}
    />
  )
}

export default Hero

