/**
 * Card Component
 * TODO: Implement card container with title, content, actions
 */

const Card = ({ title, children, actions }) => {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {actions && <div className="card-footer">{actions}</div>}
    </div>
  )
}

export default Card

