import MaskedTextField from '@/components/MaskedTextField/MaskedTextField';
import { useCompanies } from '@/models/company';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  FormControl,
  Input,
  InputLabel,
  InputBaseComponentProps,
  Alert,
  Snackbar,
} from '@mui/material';
import { ElementType, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { create: registerCompany } = useCompanies(
    1,
    1,
    {},
    {
      onError: error => {
        setError(error as Error);
        setLoading(false);
      },
      onSuccess: () => {
        setLoading(false);
      },
    },
  );
  const [registrationData, setRegistrationData] =
    useState<EnergizouRegistrations.RestAPI.RegisterCompanyForm>({
      reason: '',
      name: '',
      password: '',
      email: '',
      cep: '',
      number: '',
      street: '',
      cnpj: '',
    });

  const showError = Boolean(error);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRegistrationData({
      ...registrationData,
      [event.target.name]: event.target.value,
    });
  }

  function handleClose(reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    await registerCompany(registrationData);
    navigate('/companies');
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
                    onChange={handleChange}
                    fullWidth
                    label="Representative Email"
                    variant="outlined"
                    type="email"
                    name="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    fullWidth
                    label="Representative Name"
                    variant="outlined"
                    name="name"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    fullWidth
                    label="Corporate Reason"
                    variant="outlined"
                    required
                    name="reason"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    fullWidth
                    label="Password (Representative Password)"
                    variant="outlined"
                    type="password"
                    name="password"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="cep-input">CEP</InputLabel>
                    <Input
                      onChange={handleChange}
                      name="cep"
                      id="cep-input"
                      inputComponent={
                        MaskedTextField as unknown as ElementType<InputBaseComponentProps>
                      }
                      // @ts-ignore
                      mask="99999-999"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="cnpj-input">CNPJ</InputLabel>
                    <Input
                      onChange={handleChange}
                      name="cnpj"
                      id="cnpj-input"
                      inputComponent={
                        MaskedTextField as unknown as ElementType<InputBaseComponentProps>
                      }
                      // @ts-ignore
                      mask="99.999.999/9999-99"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    fullWidth
                    label="Street"
                    variant="outlined"
                    required
                    name="street"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="number-input">Number</InputLabel>
                    <Input
                      onChange={handleChange}
                      name="number"
                      id="number-input"
                      inputComponent={
                        MaskedTextField as unknown as ElementType<InputBaseComponentProps>
                      }
                      // @ts-ignore
                      mask="999"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="phone-number-input">
                      Phone number
                    </InputLabel>
                    <Input
                      name="phone"
                      id="phone-number-input"
                      inputComponent={
                        MaskedTextField as unknown as ElementType<InputBaseComponentProps>
                      }
                      // @ts-ignore
                      mask="(99) 99999-9999"
                      required
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 16 }}>
                Register
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
          severity="error"
          sx={{ width: '100%' }}>
          {error && error.message}
        </Alert>
      </Snackbar>
    </>
  );
}
