import NavBar from '@/components/NavBar';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function RootPage() {
  return (
    <Container maxWidth="xl">
      <NavBar />
      <Box component={'main'} sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Container>
  );
}
