/**chỉnh lại giao diện frontend này cho thật trực quan và hiện đại đừng thay đổi gì hết chỉ cần sửa frontend thôi
 * Vehicle Detail Page - Interactive and Engaging Vehicle Details
 * Features: Image gallery, specifications, color variants, 3D model, animations
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Container,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Avatar,
  Rating,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  Badge,
  Fade,
  Zoom,
  Slide
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocalGasStation as BatteryIcon,
  Speed as SpeedIcon,
  DirectionsCar as CarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  ZoomIn as ZoomIcon,
  Close as CloseIcon,
  ThreeDRotation as ThreeDIcon,
  ElectricCar as ElectricIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon
} from '@mui/icons-material'

import vehicleService from '../../services/vehicleService'
import resolveImagePath from '../../utils/imageUtils'
import NotificationToast from '../../components/Notification/NotificationToast'
import ReservationDialog from '../../components/vehicles/ReservationDialog'

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // State management
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [failedImages, setFailedImages] = useState(new Set())
  const [zoomOpen, setZoomOpen] = useState(false)
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false)



  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' // success, error, warning, info
  })

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity })
  }

  const closeNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const generatePlaceholderDataUrl = (text, width = 1200, height = 700) => {
    const bg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    const fg = '#ffffff'
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#gradient)' />
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-family='Arial, Helvetica, sans-serif' font-size='36' font-weight='600'>${text}</text>
      </svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  const getImageSrc = (index) => {
    if (vehicle?.images && vehicle.images[index] && !failedImages.has(index)) return resolveImagePath(vehicle.images[index])
    return generatePlaceholderDataUrl(vehicle?.model || 'Electric Vehicle')
  }

  // Helper function để generate mock/default specs nếu không có data
  const getSpecValue = (value, defaultValue = 'Đang cập nhật') => {
    if (!value || value === 'N/A' || value === '') return defaultValue
    return value
  }

  // Mock data cho vehicle type với random dựa trên ID
  const getMockSpecsByType = (type, vehicleId = 1) => {
    // Dùng vehicleId để tạo "random" nhất quán cho mỗi xe
    const seed = vehicleId || 1
    
    // Random helpers với seed
    const randomInRange = (min, max, offset = 0) => {
      const val = min + ((seed + offset) % (max - min + 1))
      return val
    }
    
    const ranges = {
      sedan: {
        acceleration: { min: 4.5, max: 6.5 },
        topSpeed: { min: 190, max: 230 },
        charging: { min: 25, max: 35 },
        seats: [5],
        cargo: { min: 420, max: 520 },
        warranty: ['3 năm / 60,000 km', '4 năm / 80,000 km', '5 năm / 100,000 km']
      },
      suv: {
        acceleration: { min: 5.5, max: 7.5 },
        topSpeed: { min: 170, max: 200 },
        charging: { min: 30, max: 45 },
        seats: [5, 7],
        cargo: { min: 580, max: 720 },
        warranty: ['4 năm / 100,000 km', '5 năm / 120,000 km', '6 năm / 150,000 km']
      },
      hatchback: {
        acceleration: { min: 6.5, max: 8.5 },
        topSpeed: { min: 150, max: 180 },
        charging: { min: 20, max: 30 },
        seats: [5],
        cargo: { min: 320, max: 420 },
        warranty: ['3 năm / 50,000 km', '3 năm / 60,000 km', '4 năm / 80,000 km']
      }
    }
    
    const range = ranges[type?.toLowerCase()] || ranges.sedan
    
    // Tạo specs với biến thể
    const accel = (randomInRange(range.acceleration.min * 10, range.acceleration.max * 10, 1) / 10).toFixed(1)
    const topSpeed = randomInRange(range.topSpeed.min, range.topSpeed.max, 2)
    const charging = randomInRange(range.charging.min, range.charging.max, 3)
    const seats = range.seats[seed % range.seats.length]
    const cargo = randomInRange(range.cargo.min, range.cargo.max, 4)
    const warranty = range.warranty[seed % range.warranty.length]
    
    return {
      acceleration: `${accel} giây`,
      topSpeed: `${topSpeed} km/h`,
      charging: `${charging} phút (80%)`,
      seats: `${seats} chỗ`,
      cargo: `${cargo} lít`,
      warranty: warranty
    }
  }
  
  const [activeTab, setActiveTab] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load vehicle data
  useEffect(() => {
    loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vehicleService.getVehicleById(id)
      setVehicle(response)
    } catch (err) {
      setError(err.message || 'Failed to load vehicle details')
      console.error('Error loading vehicle:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/vehicles/${id}/edit`)
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleting(true)
      await vehicleService.deleteVehicle(id)
      navigate('/vehicles')
    } catch (err) {
      setError(err.message || 'Failed to delete vehicle')
      console.error('Error deleting vehicle:', err)
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleImageChange = (index) => {
    setSelectedImage(index)
  }

  const handleColorChange = (index) => {
    setSelectedColor(index)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle?.model,
        text: vehicle?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Could show a toast notification here
    }
  }



  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main', mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Đang tải chi tiết xe...
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Vui lòng chờ trong giây lát
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(211, 47, 47, 0.1)',
            border: '1px solid rgba(211, 47, 47, 0.1)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Alert>
      </Container>
    )
  }

  if (!vehicle) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="warning" 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(237, 108, 2, 0.1)',
            border: '1px solid rgba(237, 108, 2, 0.1)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Không tìm thấy xe
          </Typography>
        </Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)'
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', top: -50, right: -50, opacity: 0.1 }}>
              <ElectricIcon sx={{ fontSize: 200 }} />
            </Box>
            
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              <IconButton 
                onClick={() => navigate('/vehicles')} 
                sx={{ 
                  borderRadius: 3, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={vehicle.type === 'sedan' ? 'Sedan' : vehicle.type === 'suv' ? 'SUV' : vehicle.type === 'hatchback' ? 'Hatchback' : vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                    color="primary"
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Chip
                    icon={<LocationIcon fontSize="small" />}
                    label={vehicle.dealerName}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {vehicle.model}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  {vehicle.description}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/vehicles/compare?ids=${id}`)}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 3,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  🔄 So sánh xe
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        <Grid container spacing={4}>
          {/* Left Column - Image Gallery */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Slide in={true} direction="up" timeout={600}>
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: 'white',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  mb: 4,
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                {/* Main Image */}
                <Box sx={{ position: 'relative', height: { xs: 400, md: 600 }, overflow: 'hidden', bgcolor: '#f0f9ff' }}>
                  {imageLoading && (
                    <Box sx={{ 
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      zIndex: 5 
                    }}>
                      <CircularProgress sx={{ color: 'white' }} />
                    </Box>
                  )}

                  <img
                    src={getImageSrc(selectedImage)}
                    alt={vehicle.model}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setFailedImages(prev => { const s = new Set(prev); s.add(selectedImage); return s })}
                    onClick={() => setZoomOpen(true)}
                    role="button"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: imageLoading ? 'none' : 'block',
                      transition: 'transform 0.5s ease',
                      cursor: 'zoom-in'
                    }}
                  />

                  {/* Navigation Dots */}
                  {vehicle.images && vehicle.images.length > 1 && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 20, 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      display: 'flex', 
                      gap: 1, 
                      zIndex: 6 
                    }}>
                      {vehicle.images.map((_, i) => (
                        <Box
                          key={i}
                          onClick={() => { setSelectedImage(i); setImageLoading(true) }}
                          sx={{
                            width: selectedImage === i ? 16 : 8,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: selectedImage === i ? 'primary.main' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: selectedImage === i ? 'primary.dark' : 'rgba(255,255,255,0.8)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Vehicle Name Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: 20,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 3,
                      py: 2,
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {vehicle.model}
                    </Typography>
                  </Box>

                  {/* Navigation Arrows */}
                  {vehicle.images && vehicle.images.length > 1 && (
                    <>
                      <IconButton
                        onClick={() => handleImageChange(selectedImage > 0 ? selectedImage - 1 : vehicle.images.length - 1)}
                        sx={{
                          position: 'absolute',
                          left: 20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '50%',
                          width: 56,
                          height: 56,
                          p: 0,
                          '&:hover': {
                            bgcolor: 'white',
                            transform: 'translateY(-50%) scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <PrevIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleImageChange(selectedImage < vehicle.images.length - 1 ? selectedImage + 1 : 0)}
                        sx={{
                          position: 'absolute',
                          right: 20,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '50%',
                          width: 56,
                          height: 56,
                          p: 0,
                          '&:hover': {
                            bgcolor: 'white',
                            transform: 'translateY(-50%) scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <NextIcon />
                      </IconButton>
                    </>
                  )}

                  {/* Image Counter */}
                  {vehicle.images && vehicle.images.length > 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {selectedImage + 1} / {vehicle.images.length}
                    </Box>
                  )}
                </Box>

                {/* Thumbnail Gallery */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <Box sx={{ p: 3, display: 'flex', gap: 2, overflowX: 'auto', bgcolor: 'grey.50' }}>
                    {vehicle.images.map((image, index) => (
                      <Box
                        key={index}
                        onClick={() => { setSelectedImage(index); setImageLoading(true) }}
                        sx={{
                          minWidth: 100,
                          height: 80,
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: selectedImage === index ? '3px solid #1976d2' : '3px solid transparent',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          '&:hover': {
                            borderColor: 'primary.main',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        <img
                          src={!failedImages.has(index) ? resolveImagePath(image) : generatePlaceholderDataUrl(vehicle.model, 240, 140)}
                          alt={`${vehicle.model} ${index + 1}`}
                          onError={() => setFailedImages(prev => { const s = new Set(prev); s.add(index); return s })}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {selectedImage === index && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <CheckIcon sx={{ color: 'white', fontSize: 14 }} />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Slide>

            {/* Color Variants */}
            {vehicle.colorVariants && vehicle.colorVariants.length > 0 && (
              <Fade in={true} timeout={800}>
                <Card sx={{ 
                  borderRadius: 4,
                  bgcolor: 'white',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  mb: 4
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PaletteIcon sx={{ color: 'primary.main' }} />
                      Màu sắc có sẵn
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                      {vehicle.colorVariants.map((color, index) => (
                        <Box
                          key={color.id}
                          onClick={() => handleColorChange(index)}
                          sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              bgcolor: color.hex,
                              border: selectedColor === index ? '4px solid #1976d2' : '3px solid rgba(0,0,0,0.1)',
                              boxShadow: selectedColor === index ? '0 8px 25px rgba(25, 118, 210, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              '&:hover': {
                                transform: 'scale(1.15)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            {selectedColor === index && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                              >
                                <CheckIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                              </Box>
                            )}
                            {color.stock === 0 && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  inset: 0,
                                  borderRadius: '50%',
                                  bgcolor: 'rgba(0,0,0,0.6)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <CloseIcon sx={{ color: 'white', fontSize: 28 }} />
                              </Box>
                            )}
                          </Box>
                          <Typography variant="caption" sx={{ 
                            display: 'block', 
                            textAlign: 'center', 
                            mt: 1, 
                            fontWeight: 600,
                            color: selectedColor === index ? 'primary.main' : 'text.primary'
                          }}>
                            {color.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {vehicle.colorVariants[selectedColor] && (
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          bgcolor: 'primary.50',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'primary.100'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: vehicle.colorVariants[selectedColor].hex,
                              border: '3px solid white',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                              {vehicle.colorVariants[selectedColor].name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                              {vehicle.colorVariants[selectedColor].stock} xe có sẵn
                            </Typography>
                          </Box>
                          <Chip 
                            label="Đã chọn" 
                            color="primary" 
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                        </Stack>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            )}

            {/* Specifications Tabs */}
            <Fade in={true} timeout={1000}>
              <Card sx={{ 
                borderRadius: 4, 
                bgcolor: 'white',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      minHeight: 70,
                      color: 'text.secondary',
                      '&.Mui-selected': {
                        color: 'primary.main',
                      }
                    }
                  }}
                >
                  <Tab 
                    icon={<BuildIcon sx={{ mb: 0.5 }} />} 
                    iconPosition="start" 
                    label="Thông số kỹ thuật" 
                  />
                  <Tab 
                    icon={<StarIcon sx={{ mb: 0.5 }} />} 
                    iconPosition="start" 
                    label="Tính năng" 
                  />
                  <Tab 
                    icon={<SecurityIcon sx={{ mb: 0.5 }} />} 
                    iconPosition="start" 
                    label="Bảo hành & Hỗ trợ" 
                  />
                </Tabs>

                <Box sx={{ p: 4 }}>
                  {activeTab === 0 && (
                    <Grid container spacing={4}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BuildIcon color="primary" />
                          Thông số động cơ & hiệu suất
                        </Typography>
                        <Stack spacing={3}>
                          {[
                            { label: 'Tăng tốc 0-100 km/h:', value: getSpecValue(vehicle.specifications?.acceleration, getMockSpecsByType(vehicle.type, vehicle.id).acceleration) },
                            { label: 'Tốc độ tối đa:', value: getSpecValue(vehicle.specifications?.topSpeed, getMockSpecsByType(vehicle.type, vehicle.id).topSpeed) },
                            { label: 'Sạc nhanh:', value: getSpecValue(vehicle.specifications?.charging, getMockSpecsByType(vehicle.type, vehicle.id).charging) },
                            { label: 'Công suất động cơ:', value: getSpecValue(vehicle.motorPower, 'Đang cập nhật') }
                          ].map((spec, index) => (
                            <Box key={index} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'grey.50',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: 'primary.50',
                                transform: 'translateX(8px)'
                              }
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {spec.label}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {spec.value}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CarIcon color="primary" />
                          Kích thước & tiện nghi
                        </Typography>
                        <Stack spacing={3}>
                          {[
                            { label: 'Số chỗ ngồi:', value: getSpecValue(vehicle.specifications?.seats, getMockSpecsByType(vehicle.type, vehicle.id).seats) },
                            { label: 'Dung tích cốp:', value: getSpecValue(vehicle.specifications?.cargo, getMockSpecsByType(vehicle.type, vehicle.id).cargo) },
                            { label: 'Bảo hành:', value: getSpecValue(vehicle.specifications?.warranty, getMockSpecsByType(vehicle.type, vehicle.id).warranty) },
                            { label: 'Loại xe:', value: vehicle.type === 'sedan' ? 'Sedan' : vehicle.type === 'suv' ? 'SUV' : vehicle.type === 'hatchback' ? 'Hatchback' : vehicle.type.toUpperCase() }
                          ].map((spec, index) => (
                            <Box key={index} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'grey.50',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: 'primary.50',
                                transform: 'translateX(8px)'
                              }
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {spec.label}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {spec.value}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  )}

                  {activeTab === 1 && (
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon color="primary" />
                        Tính năng nổi bật
                      </Typography>
                      <Grid container spacing={3}>
                        {[
                          'Lái xe tự động cấp độ 2',
                          'Hỗ trợ đỗ xe tự động thông minh',
                          'Sạc không dây 15W',
                          'Kết nối smartphone không dây',
                          'Màn hình cảm ứng 15 inch',
                          'Hệ thống âm thanh cao cấp',
                          'Ghế sưởi ấm/làm mát thông minh',
                          'Cửa sổ trời toàn cảnh',
                          'Sạc siêu nhanh 250kW',
                          'Hệ thống an ninh thông minh',
                          'Kết nối 5G tích hợp',
                          'Cập nhật phần mềm từ xa'
                        ].map((feature, index) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Paper
                              sx={{
                                p: 3,
                                textAlign: 'center',
                                borderRadius: 3,
                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                                border: '1px solid rgba(25, 118, 210, 0.1)',
                                transition: 'all 0.3s ease',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover': {
                                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)'
                                }
                              }}
                            >
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {feature}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {activeTab === 2 && (
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon color="primary" />
                        Bảo hành & Hỗ trợ
                      </Typography>
                      <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Stack spacing={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.100' }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'success.dark' }}>
                                🛡️ Bảo hành xe
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {getSpecValue(vehicle.specifications?.warranty, getMockSpecsByType(vehicle.type, vehicle.id).warranty)}
                              </Typography>
                            </Paper>

                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.100' }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'info.dark' }}>
                                🔋 Bảo hành pin & động cơ
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                8 năm hoặc 100,000 dặm cho pin và động cơ điện
                              </Typography>
                            </Paper>
                          </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Stack spacing={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.100' }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'warning.dark' }}>
                                📞 Hỗ trợ 24/7
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                Đội ngũ kỹ thuật viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn mọi lúc
                              </Typography>
                            </Paper>

                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.dark' }}>
                                ⚡ Mạng lưới trạm sạc
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                Hơn 25,000 trạm sạc trên toàn quốc, đảm bảo bạn luôn di chuyển thoải mái
                              </Typography>
                            </Paper>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Card>
            </Fade>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={4}>
              {/* Reserve CTA Card */}
              <Zoom in={true} timeout={800}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    boxShadow: '0 20px 60px rgba(6, 182, 212, 0.4)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                    <ElectricIcon sx={{ fontSize: 120 }} />
                  </Box>
                  
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: 1 }}>
                          Giá xe
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>
                          ${vehicle.price.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          VND - Bao gồm VAT & phí trước bạ
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                      
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                          icon={<CarIcon sx={{ color: 'inherit !important' }} />}
                          label={`${vehicle.stockQuantity} xe có sẵn`}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                        {vehicle.stockQuantity > 0 ? (
                          <Chip
                            label="🟢 Còn hàng"
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(76, 175, 80, 0.9)',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        ) : (
                          <Chip
                            label="🔴 Hết hàng"
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(244, 67, 54, 0.9)',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        )}
                      </Stack>

                      <Stack direction="row" spacing={2} justifyContent="center">
                        {[
                          { icon: '🚚', text: 'Miễn phí vận chuyển' },
                          { icon: '🛡️', text: 'Bảo hành 4 năm' },
                          { icon: '⚡', text: 'Giao xe nhanh' }
                        ].map((item, index) => (
                          <Box key={index} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">{item.icon}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mt: 0.5 }}>
                              {item.text}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      {/* Reservation Button */}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={vehicle.stockQuantity === 0}
                        onClick={() => setReservationDialogOpen(true)}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 3,
                          textTransform: 'none',
                          bgcolor: 'white',
                          color: '#06b6d4',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.95)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
                          },
                          '&:disabled': {
                            bgcolor: 'rgba(255,255,255,0.3)',
                            color: 'rgba(255,255,255,0.5)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {vehicle.stockQuantity > 0 ? (
                          <>🚗 Đặt xe ngay</>
                        ) : (
                          <>❌ Hết hàng</>
                        )}
                      </Button>

                      {vehicle.stockQuantity > 0 && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.8)', 
                            textAlign: 'center',
                            display: 'block',
                            mt: 1
                          }}
                        >
                          💡 Bạn sẽ nhận thông báo ngay sau khi đặt xe!
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Paper>
              </Zoom>

              {/* Specifications Card */}
              <Fade in={true} timeout={1000}>
                <Paper elevation={0} sx={{ 
                  borderRadius: 4,
                  bgcolor: 'white',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <CardContent sx={{ p: 0 }}>
                    {/* Gradient Header */}
                    <Box sx={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                      p: 4,
                      color: 'white'
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        📊 Thông số kỹ thuật
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Các thông số nổi bật của xe
                      </Typography>
                    </Box>

                    {/* Specs List */}
                    <Box sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        {/* Battery */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar sx={{ 
                            bgcolor: 'primary.50', 
                            width: 56, 
                            height: 56,
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                          }}>
                            <BatteryIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Dung lượng pin
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                              {vehicle.batteryCapacity} kWh
                            </Typography>
                          </Box>
                        </Box>
                        <Divider />

                        {/* Range */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar sx={{ 
                            bgcolor: 'success.50', 
                            width: 56, 
                            height: 56,
                            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)'
                          }}>
                            <SpeedIcon sx={{ color: 'success.main', fontSize: 28 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Quãng đường
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.dark' }}>
                              {vehicle.range} km
                            </Typography>
                          </Box>
                        </Box>
                        <Divider />

                        {/* Charging Time */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar sx={{ 
                            bgcolor: 'warning.50', 
                            width: 56, 
                            height: 56,
                            boxShadow: '0 4px 15px rgba(255, 152, 0, 0.2)'
                          }}>
                            <TimeIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Thời gian sạc
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.dark' }}>
                              {vehicle.chargingTime}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider />

                        {/* Motor Power */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar sx={{ 
                            bgcolor: 'secondary.50', 
                            width: 56, 
                            height: 56,
                            boxShadow: '0 4px 15px rgba(156, 39, 176, 0.2)'
                          }}>
                            <BuildIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Công suất động cơ
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.dark' }}>
                              {vehicle.motorPower}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  </CardContent>
                </Paper>
              </Fade>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Zoom Modal */}
      <Dialog 
        open={zoomOpen} 
        onClose={() => setZoomOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4,
            bgcolor: 'black'
          }
        }}
      >
        <DialogContent sx={{ p: 0, backgroundColor: 'black', position: 'relative' }}>
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{ 
              position: 'absolute', 
              right: 16, 
              top: 16, 
              zIndex: 10, 
              color: 'white', 
              bgcolor: 'rgba(0,0,0,0.6)',
              borderRadius: '50%', 
              width: 48, 
              height: 48,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.8)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: { xs: '60vh', md: '80vh' },
            bgcolor: 'black'
          }}>
            <img
              src={getImageSrc(selectedImage)}
              alt={vehicle.model}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                borderRadius: 4
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 800,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 3,
          textAlign: 'center',
          color: 'error.main'
        }}>
          🗑️ Xóa Xe
        </DialogTitle>
        <DialogContent sx={{ pt: 3, textAlign: 'center' }}>
          <DeleteIcon sx={{ fontSize: 64, color: 'error.main', mb: 2, opacity: 0.8 }} />
          <DialogContentText sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            Bạn có chắc chắn muốn xóa <strong>"{vehicle?.model}"</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 1, color: 'text.secondary' }}>
            Hành động này không thể hoàn tác và tất cả dữ liệu xe sẽ bị mất vĩnh viễn.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4
            }}
          >
            {deleting ? 'Đang xóa...' : 'Xóa Xe'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🚗 Reservation Dialog */}
      <ReservationDialog
        open={reservationDialogOpen}
        onClose={() => setReservationDialogOpen(false)}
        vehicle={{
          ...vehicle,
          selectedColorId: vehicle?.colorVariants?.[selectedColor]?.id
        }}
      />

      {/* 🔔 Notification Toast */}
      <NotificationToast
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={closeNotification}
        autoHideDuration={6000}
        position={{ vertical: 'top', horizontal: 'right' }}
      />
    </Box>
  )
}

export default VehicleDetail