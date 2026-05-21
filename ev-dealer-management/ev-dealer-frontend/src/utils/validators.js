// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8
}

// Password strength
export const getPasswordStrength = (password) => {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { level: 'weak', color: 'error', text: 'Yếu' }
  if (strength <= 4) return { level: 'medium', color: 'warning', text: 'Trung bình' }
  return { level: 'strong', color: 'success', text: 'Mạnh' }
}

// Phone validation (Vietnam format)
export const validatePhone = (phone) => {
  const re = /^(0|\+84)[0-9]{9,10}$/
  return re.test(phone)
}

// Required field
export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

// Name validation
export const validateName = (name) => {
  return name && name.trim().length >= 2
}

