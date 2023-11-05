import { useState, type FormEvent } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAuth } from '@/contexts/auth';
import { LoadingButton } from '@mui/lab';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const showError = Boolean(error);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login('email', 'password');
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  function handleClose(reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
  }

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%' }}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    required
                    name="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    name="password"
                    required
                  />
                </Grid>
              </Grid>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 16 }}
                loading={loading}>
                Login
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={(_, reason) => handleClose(reason)}>
        <Alert
          onClose={() => handleClose()}
          severity="success"
          sx={{ width: '100%' }}>
          {error!.message}
        </Alert>
      </Snackbar>
    </>
  );
}
