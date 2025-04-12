import { AppBar, Box, Button, Toolbar, Typography, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
              MiniFarm
            </Typography>
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Avatar sx={{ mr: 1 }}>
                {user.email[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {user.email}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  {user.role}
                </Typography>
              </Box>
            </Box>
            <Button 
              color="inherit" 
              onClick={logout}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
            >
              Cerrar Sesión
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 