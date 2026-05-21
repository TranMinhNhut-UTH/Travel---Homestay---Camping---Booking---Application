/**
 * Reset Password Page
 * Form to reset user's password using a token from email
 */

import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
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
import { Lock, ArrowBack, CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material'
import authService from '../../services/authService'
import { validateRequired } from '../../utils/validators'

const ResetPassword = () => {
  // Hooks
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  // Form state
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      setError('Không tìm thấy token đặt lại mật khẩu. Vui lòng thử lại từ đầu.')
    }
  }, [token])

  // Handle input change
  const handleChange = (e) => {
    setPassword(e.target.value)
    if (passwordError) {
      setPasswordError('')
    }
  }

  // Validate form
  const validate = () => {
    if (!validateRequired(password)) {
      setPasswordError('Vui lòng nhập mật khẩu mới')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    return true
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      await authService.resetPassword(token, password)
      setSuccess(true)
      setPassword('')
      setTimeout(() => {
        navigate('/login')
      }, 3000) // Redirect to login after 3 seconds
    } catch (err) {
      setError(err || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.')
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
          mb: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Đặt Lại Mật Khẩu
      </Typography>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
          Mật khẩu của bạn đã được đặt lại thành công! Bạn sẽ được chuyển đến trang đăng nhập.
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Password Field */}
      <TextField
        fullWidth
        label="Mật khẩu mới"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={handleChange}
        error={!!passwordError}
        helperText={passwordError}
        disabled={loading || success || !token}
        margin="dense"
        size="small"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={() => setShowPassword(!showPassword)} sx={{ minWidth: 'auto' }}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </Button>
            </InputAdornment>
          )
        }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || success || !token}
        sx={{
          mt: 1.5,
          mb: 1,
          py: 1,
          fontSize: '0.9rem',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Đặt Lại Mật Khẩu'}
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

export default ResetPassword
