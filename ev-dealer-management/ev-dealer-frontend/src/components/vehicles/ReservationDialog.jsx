import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Notes as NotesIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import vehicleService from '../../services/vehicleService';
import { getDeviceToken } from '../../firebase/notificationService';

const ReservationDialog = ({ open, onClose, vehicle }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.customerEmail.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!formData.customerPhone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ (10-11 số)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Get device token for push notifications
      const deviceToken = getDeviceToken();
      console.log('📱 Device Token:', deviceToken ? 'Available' : 'Not available');

      // Call reservation API
      const response = await vehicleService.reserveVehicle(vehicle.id, {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        colorVariantId: vehicle.selectedColorId || null,
        notes: formData.notes,
        quantity: 1,
        deviceToken: deviceToken // Send token to backend
      });

      console.log('✅ Reservation successful:', response);
      
      // Show success state
      setSuccess(true);
      
      // Wait 2 seconds then close
      setTimeout(() => {
        handleClose();
        // Optionally reload vehicle data or navigate
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error('❌ Reservation failed:', err);
      setError(err.message || 'Đặt xe thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: ''
      });
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: 700,
        fontSize: '1.5rem',
        textAlign: 'center',
        py: 3
      }}>
        {success ? '✅ Đặt xe thành công!' : '🚗 Đặt xe'}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Đặt xe thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Chúng tôi đã nhận được yêu cầu đặt xe của bạn cho <strong>{vehicle.model}</strong>
            </Typography>
            <Chip 
              icon={<CheckIcon />}
              label="Thông báo đã được gửi đến thiết bị của bạn"
              color="success"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Vehicle Info */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.50', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.100'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Xe bạn chọn:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {vehicle.model}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giá: <strong>${vehicle.price?.toLocaleString()}</strong>
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Form Fields */}
            <TextField
              name="customerName"
              label="Họ và tên"
              value={formData.customerName}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="customerEmail"
              label="Email"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="customerPhone"
              label="Số điện thoại"
              value={formData.customerPhone}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              placeholder="0123456789"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="notes"
              label="Ghi chú (không bắt buộc)"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              disabled={loading}
              placeholder="Thời gian liên hệ phù hợp, yêu cầu đặc biệt..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                    <NotesIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Info Note */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                💡 <strong>Lưu ý:</strong> Sau khi đặt xe thành công, bạn sẽ nhận được thông báo push notification 
                ngay lập tức trên trình duyệt này!
              </Typography>
            </Alert>
          </Stack>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a4293 100%)',
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Đang xử lý...
              </>
            ) : (
              '🚗 Đặt xe ngay'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReservationDialog;
