import { useState, type FormEvent } from 'react';
import { Card, CardContent, TextField, Grid, Alert } from '@mui/material';
import { useAuth } from '@/contexts/auth';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState<{
    email: EnergizouRegistrations.Models.User['email'];
    password: string;
  }>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(loginForm.email, loginForm.password);
      navigate('/');
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
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
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                loading={loading}>
                Login
              </LoadingButton>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error && error.message}
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
