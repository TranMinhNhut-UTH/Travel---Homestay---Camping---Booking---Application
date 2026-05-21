import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

const ModernCard = ({
  title,
  subtitle,
  value,
  change,
  changeType = 'positive', // 'positive', 'negative', 'neutral'
  icon,
  color = 'primary',
  progress,
  actions = [],
  avatar,
  className = '',
  onClick,
  ...props
}) => {
  const theme = useTheme();

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUpIcon fontSize="small" />;
      case 'negative':
        return <TrendingDownIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Card
      className={`modern-card card-hover ${className}`}
      onClick={onClick}
      sx={{
        borderRadius: 3,
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-2px)',
        },
        ...props.sx
      }}
      {...props}
    >
      <CardHeader
        avatar={
          avatar ? (
            <Avatar
              src={avatar.src}
              sx={{
                bgcolor: `${color}.main`,
                width: 48,
                height: 48,
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }}
            >
              {avatar.alt || icon}
            </Avatar>
          ) : (
            <Avatar
              sx={{
                bgcolor: `${color}.main`,
                width: 48,
                height: 48,
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }}
            >
              {icon}
            </Avatar>
          )
        }
        action={
          actions.length > 0 && (
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1rem'
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                mt: 0.5
              }}
            >
              {subtitle}
            </Typography>
          )
        }
        sx={{
          pb: 1,
          '& .MuiCardHeader-content': {
            overflow: 'hidden'
          }
        }}
      />
      
      <CardContent sx={{ pt: 0, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: '2rem',
              lineHeight: 1.2
            }}
          >
            {value}
          </Typography>
          
          {change && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getChangeIcon()}
              <Typography
                variant="body2"
                sx={{
                  color: getChangeColor(),
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {change}
              </Typography>
            </Box>
          )}
        </Box>

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: `${color}.main`
                }
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                mt: 0.5,
                display: 'block'
              }}
            >
              {progress}% hoàn thành
            </Typography>
          </Box>
        )}
      </CardContent>

      {actions.length > 0 && (
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          {actions.map((action, index) => (
            <Chip
              key={index}
              label={action.label}
              size="small"
              color={action.color || 'primary'}
              variant={action.variant || 'outlined'}
              onClick={action.onClick}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            />
          ))}
        </CardActions>
      )}
    </Card>
  );
};

export default ModernCard;
