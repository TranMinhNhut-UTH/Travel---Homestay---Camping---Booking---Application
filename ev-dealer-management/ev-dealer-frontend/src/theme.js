import { createTheme } from '@mui/material/styles';

// Create a modern, beautiful theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#06b6d4', // Cyan - Xanh nhạt chủ đạo
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#14b8a6', // Teal - Xanh lá nhạt
      light: '#2dd4bf',
      dark: '#0d9488',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Modern green
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Modern amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Modern red
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#ecfeff', // Very light cyan - Nền xanh nhạt
      paper: '#ffffff',   // Pure white
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: { 
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h3: { 
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: { 
      fontWeight: 600, 
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: { 
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: { 
      fontWeight: 500, 
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    // AppBar styling
    MuiAppBar: {
      styleOverrides: {
        root: {
          elevation: 0,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
    // Drawer styling
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '4px 0px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    // List styling
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: '#f1f5f9',
            transform: 'translateX(4px)',
            transition: 'all 0.2s ease-in-out',
          },
          '&.Mui-selected': {
            backgroundColor: '#dbeafe',
            color: '#2563eb',
            '&:hover': {
              backgroundColor: '#bfdbfe',
            },
            '& .MuiListItemIcon-root': {
              color: '#2563eb',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: '#64748b',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    // Paper styling
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    // Button styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    // Card styling
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    // Table styling
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#f8fafc',
          },
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#374151',
          fontSize: '0.875rem',
        },
        body: {
          fontSize: '0.875rem',
          color: '#6b7280',
        },
      },
    },
  },
});

export default theme;
