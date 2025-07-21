import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  );
};

export default PublicLayout; 