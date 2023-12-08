import CEPInput from '@/components/CEPInput';
import CNPJInput from '@/components/CNPJInput';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import StreetNumberInput from '@/components/StreetNumberInput';
import { ValidationError } from '@/errors';
import {
  type CompanyRegistrationPayload,
  registerCompany,
} from '@/models/company';
import { DomainAdd, Warning } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  FormControl,
  GridProps,
  Divider,
  Typography,
  FormHelperText,
  TextFieldProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import type { AxiosInstance } from 'axios';
import { useState, type ElementType, type PropsWithChildren } from 'react';
import {
  type ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';

export function getRegisterCompanyAction(axiosInstance: AxiosInstance) {
  return async function ({ request }: ActionFunctionArgs) {
    try {
      await registerCompany(
        axiosInstance,
        (await request.json()) as unknown as CompanyRegistrationPayload,
      );
      return redirect('/companies');
    } catch (error) {
      if (error instanceof ValidationError) {
        return error.fieldErrors;
      }
      throw error;
    }
  };
}

type FormSectionGridProps = PropsWithChildren<
  {
    title: ElementType | string;
  } & GridProps
>;

function RegistrationTextField({ name, label, ...props }: TextFieldProps) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      label={label}
      name={name}
      {...props}
      size="small"
    />
  );
}

function FormSectionGrid({ children, title, ...props }: FormSectionGridProps) {
  return (
    <Grid {...props}>
      <Grid item xs={12}>
        <Typography variant="h6">{title}</Typography>
        <Divider />
      </Grid>
      {children}
    </Grid>
  );
}

export default function CompanyRegistrationPage() {
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const [registrationForm, setRegistrationForm] = useState({
    email: '',
    name: '',
    password: '',
    reason: '',
    cnpj: '',
    phone: '',
    street: '',
    number: '',
    cep: '',
  });
  const submit = useSubmit();
  const errors = useActionData() as Awaited<
    ReturnType<ReturnType<typeof getRegisterCompanyAction>>
  >;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setRegistrationForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: Partial<
      Omit<CompanyRegistrationPayload, 'address' | 'representative'>
    > & {
      address: Partial<CompanyRegistrationPayload['address']>;
      representative: Partial<CompanyRegistrationPayload['representative']>;
    } = { address: {}, representative: {} };

    const infoKeys: (keyof CompanyRegistrationPayload)[] = [
      'cnpj',
      'phone',
      'reason',
    ];
    // @ts-ignore
    infoKeys.forEach(key => (payload[key] = registrationForm[key]));

    const addressKeys: (keyof CompanyRegistrationPayload['address'])[] = [
      'street',
      'number',
      'cep',
    ];
    addressKeys.forEach(
      key => (payload.address[key] = registrationForm[key] as string),
    );

    const representativeKeys: (keyof CompanyRegistrationPayload['representative'])[] =
      ['name', 'email', 'password'];
    representativeKeys.forEach(
      key => (payload.representative[key] = registrationForm[key] as string),
    );

    submit(payload, {
      method: 'POST',
      action: '/companies/new',
      encType: 'application/json',
    });
  }

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <DomainAdd fontSize="inherit" sx={{ mr: 1 }} /> Novo Cliente
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Form onSubmit={handleSubmit}>
          <FormSectionGrid
            container
            spacing={2}
            title="Representante"
            sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <RegistrationTextField
                label="Email"
                type="email"
                name="email"
                disabled={submitting}
                required
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <RegistrationTextField
                label="Nome"
                name="name"
                required
                disabled={submitting}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <RegistrationTextField
                  label="Senha"
                  type="password"
                  name="password"
                  disabled={submitting}
                  required
                  onChange={handleChange}
                />
                <FormHelperText>
                  Deve ter pelo menos uma letra minúscula, uma maiúscula, um
                  número, um caractere especial e no mínimo 8 caracteres.
                </FormHelperText>
              </FormControl>
            </Grid>
          </FormSectionGrid>
          <FormSectionGrid
            container
            spacing={2}
            title="Cadastro"
            sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <RegistrationTextField
                label="Razão Social"
                required
                name="reason"
                disabled={submitting}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <RegistrationTextField
                name="cnpj"
                label="CNPJ"
                id="cnpj-input"
                InputProps={{
                  inputComponent: CNPJInput as any,
                }}
                required
                disabled={submitting}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <RegistrationTextField
                name="phone"
                id="phone-number-input"
                label="Telefone"
                InputProps={{
                  inputComponent: PhoneNumberInput as any,
                }}
                required
                disabled={submitting}
                onChange={handleChange}
              />
            </Grid>
          </FormSectionGrid>
          <FormSectionGrid
            container
            spacing={2}
            title="Endereço"
            sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <RegistrationTextField
                name="cep"
                id="cep-input"
                label="CEP"
                InputProps={{
                  inputComponent: CEPInput as any,
                }}
                required
                disabled={submitting}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <RegistrationTextField
                label="Rua"
                required
                name="street"
                disabled={submitting}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <RegistrationTextField
                name="number"
                id="number-input"
                label="Número"
                InputProps={{
                  inputComponent: StreetNumberInput as any,
                }}
                required
                disabled={submitting}
                onChange={handleChange}
              />
            </Grid>
          </FormSectionGrid>
          <LoadingButton
            type="submit"
            loading={navigation.state === 'submitting'}
            variant="contained"
            color="primary"
            fullWidth>
            Cadastrar
          </LoadingButton>
        </Form>
        {errors && (
          <Alert severity="error" icon={false} sx={{ mt: 2 }}>
            <List disablePadding>
              {Object.values(errors).map((error, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon>
                    <Warning color="error" />
                  </ListItemIcon>
                  <ListItemText primary={error} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
