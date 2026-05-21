/**
 * Form Components
 * Reusable form wrappers and form elements
 */

import { useState } from 'react'
import { Input, Button } from './index'

// Form Wrapper Component
const Form = ({
  children,
  onSubmit,
  className = '',
  loading = false,
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <form 
      className={`form ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  )
}

// Form Group Component
const FormGroup = ({
  children,
  label,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="form-group-content">
        {children}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

// Form Row Component
const FormRow = ({
  children,
  columns = 1,
  gap = 'medium',
  className = ''
}) => {
  const rowClasses = [
    'form-row',
    `form-row-${columns}`,
    `form-row-gap-${gap}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={rowClasses}>
      {children}
    </div>
  )
}

// Form Actions Component
const FormActions = ({
  children,
  align = 'right',
  className = ''
}) => {
  const actionsClasses = [
    'form-actions',
    `form-actions-${align}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={actionsClasses}>
      {children}
    </div>
  )
}

// Login Form Component
const LoginForm = ({
  onSubmit,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className={`login-form ${className}`}>
      <FormGroup label="Email" required error={errors.email}>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập email của bạn"
          icon="✉️"
        />
      </FormGroup>

      <FormGroup label="Mật khẩu" required error={errors.password}>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu"
          icon="🔒"
        />
      </FormGroup>

      <FormActions>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          disabled={loading}
        >
          Đăng nhập
        </Button>
      </FormActions>
    </Form>
  )
}

// Register Form Component
const RegisterForm = ({
  onSubmit,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = 'Tên là bắt buộc'
    }
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className={`register-form ${className}`}>
      <FormRow columns={2}>
        <FormGroup label="Họ và tên" required error={errors.name}>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            icon="👤"
          />
        </FormGroup>

        <FormGroup label="Email" required error={errors.email}>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            icon="✉️"
          />
        </FormGroup>
      </FormRow>

      <FormRow columns={2}>
        <FormGroup label="Mật khẩu" required error={errors.password}>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            icon="🔒"
          />
        </FormGroup>

        <FormGroup label="Xác nhận mật khẩu" required error={errors.confirmPassword}>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            icon="🔒"
          />
        </FormGroup>
      </FormRow>

      <FormActions>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          disabled={loading}
        >
          Đăng ký
        </Button>
      </FormActions>
    </Form>
  )
}

// Contact Form Component
const ContactForm = ({
  onSubmit,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name) newErrors.name = 'Tên là bắt buộc'
    if (!formData.email) newErrors.email = 'Email là bắt buộc'
    if (!formData.subject) newErrors.subject = 'Chủ đề là bắt buộc'
    if (!formData.message) newErrors.message = 'Tin nhắn là bắt buộc'

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className={`contact-form ${className}`}>
      <FormRow columns={2}>
        <FormGroup label="Họ và tên" required error={errors.name}>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            icon="👤"
          />
        </FormGroup>

        <FormGroup label="Email" required error={errors.email}>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            icon="✉️"
          />
        </FormGroup>
      </FormRow>

      <FormRow columns={2}>
        <FormGroup label="Số điện thoại" error={errors.phone}>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            icon="📞"
          />
        </FormGroup>

        <FormGroup label="Chủ đề" required error={errors.subject}>
          <Input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Nhập chủ đề"
            icon="📝"
          />
        </FormGroup>
      </FormRow>

      <FormGroup label="Tin nhắn" required error={errors.message}>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Nhập tin nhắn của bạn"
          className="form-textarea"
          rows={5}
        />
      </FormGroup>

      <FormActions>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          disabled={loading}
        >
          Gửi tin nhắn
        </Button>
      </FormActions>
    </Form>
  )
}

export {
  Form,
  FormGroup,
  FormRow,
  FormActions,
  LoginForm,
  RegisterForm,
  ContactForm
}

