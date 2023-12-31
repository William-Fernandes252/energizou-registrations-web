import LinkButton from '@/components/LinkButton';
import ConfirmActionDialog from '@/components/ConfirmActionDialog';
import { getCompany } from '@/models/company';
import { formatCnpj, formatPhoneNumber } from '@/utils/format';
import { Business, Delete, Edit, Person } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
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
import { useState, type PropsWithChildren } from 'react';
import { useLoaderData, type LoaderFunctionArgs, Form } from 'react-router-dom';

export function getCompanyDetailLoader(axiosInstance: AxiosInstance) {
  return async function ({
    params,
  }: LoaderFunctionArgs<{ params: { cnpj: string } }>) {
    return await getCompany(axiosInstance, params.cnpj!);
  };
}

function SectionTitle({ children }: PropsWithChildren) {
  return <Typography variant="h6">{children}</Typography>;
}

function Section({ children }: PropsWithChildren) {
  return <Box sx={{ mb: 2 }}>{children}</Box>;
}

export default function CompanyDetailPage() {
  const [showConfirmDeleteDialog, setshowConfirmDeleteDialog] = useState(false);
  const company = useLoaderData() as Awaited<ReturnType<typeof getCompany>>;

  function handleClickDelete() {
    setshowConfirmDeleteDialog(true);
  }

  function handleClose() {
    setshowConfirmDeleteDialog(false);
  }

  return (
    <>
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
                <Typography variant="body2">{`${company.address.street}, ${company.address.number}`}</Typography>
              </Grid>
            </Grid>
          </Section>
          <Section>
            <SectionTitle>Representante</SectionTitle>
            <Typography variant="body2">
              {company.representative.email}
            </Typography>
          </Section>
          <Section>
            <SectionTitle>Usuários</SectionTitle>
            <List dense disablePadding>
              {company.users.map(user => (
                <ListItem key={user.id}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText>{user.email}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Section>
        </CardContent>
        <CardActions>
          <LinkButton startIcon={<Edit />} to="edit">
            Editar
          </LinkButton>
          <Button
            startIcon={<Delete />}
            color="warning"
            onClick={handleClickDelete}>
            Deletar
          </Button>
          <Form method="post" action={'delete'} id="company-delete-form" />
        </CardActions>
      </Card>
      <ConfirmActionDialog
        open={showConfirmDeleteDialog}
        title="Deletar cliente"
        message="Tem certeza que deseja deletar o cliente?"
        cancelButton={
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
        }
        confirmButton={
          <Button
            type="submit"
            form="company-delete-form"
            color="warning"
            onClick={handleClose}
            startIcon={<Delete />}>
            Deletar
          </Button>
        }
      />
    </>
  );
}
