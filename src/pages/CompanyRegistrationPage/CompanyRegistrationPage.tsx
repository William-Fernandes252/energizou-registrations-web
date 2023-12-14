import CEPInput from '@/components/CEPInput';
import CNPJInput from '@/components/CNPJInput';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import StreetNumberInput from '@/components/StreetNumberInput';
import { ValidationError } from '@/errors';
import useCompanyMutationForm from '@/hooks/useCompanyMutationForm';
import { type CompanyMutationPayload, registerCompany } from '@/models/company';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import type { AxiosInstance } from 'axios';
import type { ElementType, PropsWithChildren } from 'react';
import { type ActionFunctionArgs, Form, redirect } from 'react-router-dom';

export function getRegisterCompanyAction(axiosInstance: AxiosInstance) {
  return async function ({ request }: ActionFunctionArgs) {
    try {
      await registerCompany(
        axiosInstance,
        (await request.json()) as unknown as CompanyMutationPayload,
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
  const {
    addressInput,
    handleInfoInputChange,
    handleAddressInputChange,
    handleRepresentativeInputChange,
    handleSubmit,
    errors,
    submitting,
    fetchingCEP,
  } = useCompanyMutationForm('/companies/new', 'POST');
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
              <TextField
                label="Email"
                type="email"
                name="email"
                disabled={submitting}
                required
                autoFocus
                onChange={handleRepresentativeInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nome"
                name="name"
                required
                disabled={submitting}
                onChange={handleRepresentativeInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  label="Senha"
                  type="password"
                  name="password"
                  disabled={submitting}
                  required
                  onChange={handleRepresentativeInputChange}
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
              <TextField
                label="Razão Social"
                required
                name="reason"
                disabled={submitting}
                onChange={handleInfoInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="cnpj"
                label="CNPJ"
                id="cnpj-input"
                InputProps={{
                  inputComponent: CNPJInput as any,
                }}
                required
                disabled={submitting}
                onChange={handleInfoInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                id="phone-number-input"
                label="Telefone"
                InputProps={{
                  inputComponent: PhoneNumberInput as any,
                }}
                required
                disabled={submitting}
                onChange={handleInfoInputChange}
              />
            </Grid>
          </FormSectionGrid>
          <FormSectionGrid
            container
            spacing={2}
            title="Endereço"
            sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField
                name="cep"
                id="cep-input"
                label="CEP"
                InputProps={{
                  inputComponent: CEPInput as any,
                }}
                required
                disabled={submitting}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Rua"
                required
                name="street"
                value={addressInput.street}
                disabled={submitting || fetchingCEP}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="number"
                id="number-input"
                label="Número"
                InputProps={{
                  inputComponent: StreetNumberInput as any,
                }}
                required
                disabled={submitting || fetchingCEP}
                onChange={handleAddressInputChange}
              />
            </Grid>
          </FormSectionGrid>
          <LoadingButton
            type="submit"
            loading={submitting}
            variant="contained"
            color="primary"
            fullWidth>
            Cadastrar
          </LoadingButton>
        </Form>
        {errors && (
          <FormErrorsAlert errors={errors as Record<string, string>} />
        )}
      </CardContent>
    </Card>
  );
}
