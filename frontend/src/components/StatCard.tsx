import { Paper, Typography, Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: 'default' | 'primary' | 'error';
  sx?: SxProps<Theme>;
}

const StatCard = ({ title, value, icon, color = 'default', sx }: StatCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        ...sx
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography 
          variant="body2"
          sx={{ 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: color === 'default' ? 'text.secondary' : `${color}.main`,
            opacity: 0.8
          }}
        >
          {title}
        </Typography>
        <Box 
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            borderRadius: 1.5,
            backgroundColor: theme.palette.grey[100],
            '& .MuiSvgIcon-root': {
              fontSize: '1.25rem',
              color: color === 'default' ? theme.palette.text.secondary : theme.palette[color || 'primary'].main,
              opacity: 0.8
            }
          })}
        >
          {icon}
        </Box>
      </Box>
      <Typography 
        variant="h4" 
        component="div"
        sx={(theme) => ({
          fontWeight: 700,
          color: color === 'default' ? theme.palette.text.primary : theme.palette[color || 'primary'].main,
          lineHeight: 1
        })}
      >
        {value}
      </Typography>
    </Paper>
  );
};

export default StatCard; 