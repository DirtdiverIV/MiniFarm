import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  IconButton,
  Button,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  Agriculture as AgricultureIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { themeColors } from '../theme/theme';

const Header = () => {
  const { logout, user } = useAuth();
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={theme => ({
        bgcolor: themeColors.primary.main,
        boxShadow: theme.shadows[4]
      })}
    >
      <Toolbar sx={{ height: 80, px: { xs: 2, sm: 4 } }}>
        <Box 
          component={Link} 
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: 2
          }}
        >
          <AgricultureIcon 
            sx={{
              fontSize: 50,
              color: themeColors.common.white,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              },
              textShadow: `2px 2px 4px ${alpha(themeColors.common.black, 0.2)}`,
            }}
          />
          <Typography 
            variant="h4" 
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2.2rem' },
              letterSpacing: '0.5px',
              textShadow: `2px 2px 4px ${alpha(themeColors.common.black, 0.2)}`,
              color: themeColors.common.white
            }}
          >
            MiniFarm
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                alignItems: 'center',
                mr: 2
              }}
            >
              <PersonIcon sx={{ mr: 1, color: themeColors.common.white }} />
              <Typography variant="body1" sx={{ color: themeColors.common.white }}>
                {user.email}
              </Typography>
            </Box>
            
            <Tooltip title="Cerrar sesión">
              <IconButton 
                onClick={logout}
                sx={{ 
                  bgcolor: themeColors.error.main,
                  color: '#ffffff',
                  borderRadius: '4px',
                  width: '36px',
                  height: '36px',
                  '&:hover': {
                    bgcolor: themeColors.error.dark
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 