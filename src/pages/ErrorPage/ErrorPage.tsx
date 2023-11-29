import { useAuth } from '@/contexts/auth';
import { BaseError, UnauthorizedError } from '@/errors';
import { Box, Grid, Typography } from '@mui/material';
import SickIcon from '@mui/icons-material/Sick';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  const { logout } = useAuth();

  if (import.meta.env.DEV) {
    console.error(error);
  }

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
        <Grid
          container
          sx={{ p: 3 }}
          spacing={1}
          direction="column"
          alignContent="center"
          alignItems="center">
          <Grid item>
            <Typography
              variant="h2"
              color="error"
              sx={{ textAlign: 'center', mb: 2 }}>
              Erro <SickIcon fontSize="large" />
            </Typography>
          </Grid>
          {error instanceof Error && (
            <Grid item>
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                {(error as Error).message}
              </Typography>
            </Grid>
          )}
          {error instanceof BaseError && (
            <Grid item>
              <Typography variant="caption" sx={{ textAlign: 'center' }}>
                {error.action}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
