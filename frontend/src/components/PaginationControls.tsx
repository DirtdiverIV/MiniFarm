import { ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon 
} from '@mui/icons-material';
import { themeColors } from '../theme/theme';
import { commonStyles } from '../theme/commonStyles';

interface PaginationControlsProps<T> {
  items: T[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  renderItems: (visibleItems: T[]) => ReactNode;
}

export const PaginationControls = <T,>({
  items,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  renderItems,
}: PaginationControlsProps<T>) => {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const showNavigation = items.length > itemsPerPage;
  
  const visibleItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  const handleNextPage = () => {
    if (currentPage + 1 >= totalPages) {
      setCurrentPage(0);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage - 1 < 0) {
      setCurrentPage(totalPages - 1);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative' }}>
        {renderItems(visibleItems)}
      </Box>

      {showNavigation && (
        <>
          <IconButton
            onClick={handlePrevPage}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: themeColors.primary.main,
              color: themeColors.common.white,
              width: 40,
              height: 40,
              boxShadow: (theme) => theme.shadows[3],
              '&:hover': {
                bgcolor: themeColors.primary.dark,
              },
              '&:disabled': {
                bgcolor: themeColors.surface.containerHigh,
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: themeColors.primary.main,
              color: themeColors.common.white,
              width: 40,
              height: 40,
              boxShadow: (theme) => theme.shadows[3],
              '&:hover': {
                bgcolor: themeColors.primary.dark,
              },
              '&:disabled': {
                bgcolor: themeColors.surface.containerHigh,
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}
      
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1, 
          mt: 2 
        }}>
          {[...Array(totalPages)].map((_, index) => (
            <Box
              key={index}
              sx={{
                ...commonStyles.navigation.paginationIndicator,
                bgcolor: currentPage === index ? themeColors.primary.main : themeColors.outline.main,
              }}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PaginationControls; 