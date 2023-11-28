import { useAuth } from '@/contexts/auth';
import { BaseError, UnauthorizedError } from '@/errors';
import { Box, Grid, Typography } from '@mui/material';
import SickIcon from '@mui/icons-material/Sick';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  const { logout } = useAuth();

  if (error instanceof UnauthorizedError) {
    logout(true);
  }

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h2"
            color="error"
            sx={{ textAlign: 'center', mb: 2 }}>
            Erro <SickIcon fontSize="large" />
          </Typography>
          {error instanceof Error && (
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              {(error as Error).message}
            </Typography>
          )}
          {error instanceof BaseError && (
            <Typography variant="caption" sx={{ textAlign: 'center' }}>
              {error.action}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
