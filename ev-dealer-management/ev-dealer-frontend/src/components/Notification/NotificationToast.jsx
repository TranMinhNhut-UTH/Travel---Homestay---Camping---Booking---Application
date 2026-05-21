import React, { useEffect } from 'react';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

const NotificationToast = ({ 
  open, 
  message, 
  severity = 'success', 
  onClose,
  autoHideDuration = 5000,
  position = { vertical: 'top', horizontal: 'right' }
}) => {
  useEffect(() => {
    if (open && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, autoHideDuration]);

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      case 'info':
        return <InfoIcon fontSize="inherit" />;
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration > 0 ? autoHideDuration : null}
      onClose={onClose}
      anchorOrigin={position}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        icon={getIcon()}
        sx={{ 
          width: '100%',
          minWidth: '300px',
          boxShadow: 3,
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
            fontWeight: 500
          }
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;
