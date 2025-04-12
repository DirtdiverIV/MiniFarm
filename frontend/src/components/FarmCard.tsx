import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  CardActions,
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Farm } from '../services/farmService';

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
        maxWidth: 345, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={farm.image_path ? `http://localhost:4000${farm.image_path}` : '/placeholder-farm.jpg'}
        alt={farm.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {farm.name}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tipo de Granja: {farm.farm_type.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tipo de Producción: {farm.production_type.name}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleViewDetails}>Ver Detalles</Button>
        {onDelete && (
          <Button size="small" color="error" onClick={() => onDelete(farm.id)}>
            Eliminar
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default FarmCard; 