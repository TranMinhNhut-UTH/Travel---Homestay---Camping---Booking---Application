/**
 * Reusable Section Component
 * Wrapper for different page sections with consistent styling
 */

const Section = ({
  children,
  title,
  subtitle,
  description,
  variant = 'default', // default, primary, secondary, dark, light
  padding = 'large', // none, small, medium, large, xlarge
  background = 'transparent',
  backgroundImage,
  textAlign = 'left',
  maxWidth = 'container',
  className = '',
  id
}) => {
  const sectionClasses = [
    'section',
    `section-${variant}`,
    `section-padding-${padding}`,
    `section-align-${textAlign}`,
    backgroundImage ? 'section-bg-image' : '',
    className
  ].filter(Boolean).join(' ')

  const sectionStyle = {
    backgroundColor: background !== 'transparent' ? background : undefined,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }

  const containerClasses = [
    'section-container',
    `section-container-${maxWidth}`
  ].filter(Boolean).join(' ')

  return (
    <section 
      className={sectionClasses}
      style={sectionStyle}
      id={id}
    >
      <div className={containerClasses}>
        {/* Section Header */}
        {(title || subtitle || description) && (
          <div className="section-header">
            {subtitle && (
              <p className="section-subtitle">{subtitle}</p>
            )}
            {title && (
              <h2 className="section-title">{title}</h2>
            )}
            {description && (
              <p className="section-description">{description}</p>
            )}
          </div>
        )}

        {/* Section Content */}
        <div className="section-content">
          {children}
        </div>
      </div>
    </section>
  )
}

// Feature Section Component
export const FeatureSection = ({
  features = [],
  columns = 3,
  variant = 'default',
  className = ''
}) => {
  return (
    <Section 
      variant={variant}
      className={`feature-section ${className}`}
    >
      <div className={`feature-grid feature-grid-${columns}`}>
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            {feature.icon && (
              <div className="feature-icon">
                {feature.icon}
              </div>
            )}
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            {feature.link && (
              <a href={feature.link} className="feature-link">
                Tìm hiểu thêm →
              </a>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}

// Testimonial Section Component
export const TestimonialSection = ({
  testimonials = [],
  variant = 'default',
  className = ''
}) => {
  return (
    <Section 
      variant={variant}
      className={`testimonial-section ${className}`}
    >
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-item">
            <div className="testimonial-content">
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
            <div className="testimonial-author">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="testimonial-avatar"
              />
              <div className="testimonial-info">
                <h4 className="testimonial-name">{testimonial.name}</h4>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// Stats Section Component
export const StatsSection = ({
  stats = [],
  variant = 'default',
  className = ''
}) => {
  return (
    <Section 
      variant={variant}
      className={`stats-section ${className}`}
    >
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
            {stat.description && (
              <div className="stat-description">{stat.description}</div>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}

// CTA Section Component
export const CTASection = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  variant = 'primary',
  className = ''
}) => {
  return (
    <Section 
      variant={variant}
      className={`cta-section ${className}`}
    >
      <div className="cta-content">
        <h2 className="cta-title">{title}</h2>
        {description && (
          <p className="cta-description">{description}</p>
        )}
        <div className="cta-actions">
          {primaryButton && (
            <button 
              className="cta-button cta-button-primary"
              onClick={primaryButton.onClick}
            >
              {primaryButton.text}
            </button>
          )}
          {secondaryButton && (
            <button 
              className="cta-button cta-button-secondary"
              onClick={secondaryButton.onClick}
            >
              {secondaryButton.text}
            </button>
          )}
        </div>
      </div>
    </Section>
  )
}

export default Section

