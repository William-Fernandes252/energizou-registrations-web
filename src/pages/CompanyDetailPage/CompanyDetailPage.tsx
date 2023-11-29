import { ValidationError } from '@/errors';
import { getCompany } from '@/models/company';
import { formatCnpj, formatPhone as formatPhoneNumber } from '@/utils/format';
import { Business, Person } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import type { AxiosInstance } from 'axios';
import type { PropsWithChildren } from 'react';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';

export function getCompanyDetailLoader(axiosInstance: AxiosInstance) {
  return async function ({
    params,
  }: LoaderFunctionArgs<{ params: { cnpj: string } }>) {
    if (!params.cnpj) {
      throw new ValidationError();
    }
    return await getCompany(axiosInstance, params.cnpj);
  };
}

function SectionTitle({ children }: PropsWithChildren) {
  return <Typography variant="h6">{children}</Typography>;
}

function Section({ children }: PropsWithChildren) {
  return <Box sx={{ mb: 2 }}>{children}</Box>;
}

export default function CompanyDetailPage() {
  const company = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof getCompanyDetailLoader>>
  >;
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Business fontSize="inherit" sx={{ mr: 1 }} /> {company.reason}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Section>
          <SectionTitle>Cadastro</SectionTitle>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body1">CNPJ</Typography>
              <Typography variant="body2">
                {formatCnpj(company.cnpj)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Telefone</Typography>
              <Typography variant="body2">
                {formatPhoneNumber(company.phone)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Endereço</Typography>
              <Typography variant="body2">{company.address}</Typography>
            </Grid>
          </Grid>
        </Section>
        <Section>
          <SectionTitle>Representante</SectionTitle>
          <Typography variant="body2">{company.representative}</Typography>
        </Section>
        <Section>
          <SectionTitle>Usuários</SectionTitle>
          <List dense disablePadding>
            {company.users.map(user => (
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText>{user.email}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Section>
      </CardContent>
    </Card>
  );
}
