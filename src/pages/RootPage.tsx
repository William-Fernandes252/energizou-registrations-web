import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/auth';
import { Box, Container } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function RootPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (!isAuthenticated || user?.exp! * 1000 < Date.now()) &&
      pathname !== '/login'
    ) {
      logout();
      navigate('login');
    }
  }, [isAuthenticated, pathname, navigate]);

  return (
    <Container maxWidth="xl" sx={{ height: '100vh' }}>
      <NavBar />
      <Box component={'main'} sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Container>
  );
}
