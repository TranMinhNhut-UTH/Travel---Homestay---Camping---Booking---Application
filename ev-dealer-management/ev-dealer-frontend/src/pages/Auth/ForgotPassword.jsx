/**
 * Forgot Password Page
 * Complete password reset request form
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import { Email, ArrowBack, CheckCircle } from '@mui/icons-material'
import authService from '../../services/authService'
import { validateEmail, validateRequired } from '../../utils/validators'

const ForgotPassword = () => {
  // Form state
  const [email, setEmail] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Fix autocomplete text color
  useEffect(() => {
    const timer = setTimeout(() => {
      const inputs = document.querySelectorAll('input')
      inputs.forEach(input => {
        input.style.color = '#000000'
        input.style.webkitTextFillColor = '#000000'
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [email])

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value)
    if (emailError) {
      setEmailError('')
    }
  }

  // Validate form
  const validate = () => {
    if (!validateRequired(email)) {
      setEmailError('Vui lòng nhập email')
      return false
    }
    if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ')
      return false
    }
    return true
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validate
    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      // Call forgot password API
      await authService.forgotPassword(email)
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err || 'Gửi link thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 0.3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Quên Mật Khẩu?
      </Typography>
      <Typography variant="caption" align="center" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
      </Typography>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
          Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        fullWidth
        label="Địa chỉ Email"
        name="email"
        type="email"
        value={email}
        onChange={handleChange}
        error={!!emailError}
        helperText={emailError}
        disabled={loading || success}
        margin="dense"
        size="small"
        autoFocus
        autoComplete="email"
        inputProps={{
          spellCheck: false,
          autoCorrect: 'off',
          autoCapitalize: 'off',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Send Reset Link Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || success}
        sx={{
          mt: 1.5,
          mb: 1,
          py: 1,
          fontSize: '0.9rem',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Gửi Link Đặt Lại'}
      </Button>

      {/* Back to Login Link */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <ArrowBack sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
        <Link
          to="/login"
          style={{
            textDecoration: 'none',
            color: '#667eea',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Quay lại Đăng nhập
        </Link>
      </Box>
    </Box>
  )
}

export default ForgotPassword

