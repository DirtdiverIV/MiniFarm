import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  CardActions,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Agriculture as AgricultureIcon,
  LocalShipping as ShippingIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Farm } from '../services/farmService';
import { alpha } from '@mui/material/styles';
import { themeColors } from '../theme/theme';

interface FarmCardProps {
  farm: Farm;
  onDelete?: (id: number) => void;
}

const FarmCard = ({ farm, onDelete }: FarmCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/farms/${farm.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        backgroundColor: themeColors.surface.containerHigh,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => theme.shadows[10]
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={farm.image_path ? `http://localhost:4000${farm.image_path}` : '/placeholder-farm.jpg'}
          alt={farm.name}
          sx={{ 
            objectFit: 'cover',
          }}
        />
        <Box
          sx={(theme) => ({
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(transparent, ${alpha(theme.palette.common.black, 0.7)})`,
            p: 2,
            pt: 4
          })}
        >
          <Typography 
            variant="h5" 
            component="h2"
            sx={(theme) => ({
              color: 'common.white',
              fontWeight: 700,
              textShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`
            })}
          >
            {farm.name}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mb: 2
          }}>
            <AgricultureIcon color="primary" />
            <Box>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Tipo de Granja
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {farm.farm_type.name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mb: 2
          }}>
            <ShippingIcon color="primary" />
            <Box>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Tipo de Producción
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {farm.production_type.name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}>
            <LocationIcon color="primary" />
            <Box>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Ubicación
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {farm.municipio}, {farm.provincia}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>

      <Divider />
      
      <CardActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleViewDetails}
          startIcon={<VisibilityIcon />}
          fullWidth
        >
          Ver Detalles
        </Button>
        
        {onDelete && (
          <Tooltip title="Eliminar Granja">
            <IconButton
              size="small"
              onClick={() => onDelete(farm.id)}
              sx={{
                backgroundColor: 'error.main',
                color: '#ffffff',
                borderRadius: '4px',
                width: 'auto',
                height: 36,
                padding: '0 8px',
                '&:hover': {
                  backgroundColor: 'error.dark',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default FarmCard; 