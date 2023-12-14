import CEPInput from '@/components/CEPInput';
import CNPJInput from '@/components/CNPJInput';
import CompanyMutationFormSectionGrid from '@/components/CompanyMutationFormSectionGrid';
import ConfirmActionDialog from '@/components/ConfirmActionDialog';
import FormErrorsAlert from '@/components/FormErrorsAlert/FormErrorsAlert';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import StreetNumberInput from '@/components/StreetNumberInput';
import { ValidationError } from '@/errors';
import useCompanyMutationForm from '@/hooks/useCompanyMutationForm';
import {
  type CompanyMutationPayload,
  updateCompany,
  type getCompany,
  addUserToCompany,
  removeUserFromCompany,
} from '@/models/company';
import { Add, Delete, Edit, Person } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import type { AxiosInstance } from 'axios';
import { useState } from 'react';
import {
  type ActionFunctionArgs,
  useLoaderData,
  Form,
  redirect,
  useFetcher,
} from 'react-router-dom';

export function getUpdateCompanyAction(axiosInstance: AxiosInstance) {
  return async function ({ request, params }: ActionFunctionArgs) {
    await updateCompany(
      axiosInstance,
      params.cnpj!,
      (await request.json()) as unknown as CompanyMutationPayload,
    );
    return redirect(`/companies/${params.cnpj}`);
  };
}

export function getAddUserAction(axiosInstance: AxiosInstance) {
  return async function ({ request, params }: ActionFunctionArgs) {
    try {
      await addUserToCompany(
        axiosInstance,
        params.cnpj!,
        (await request.json()) as unknown as EnergizouRegistrations.Models.User,
      );
      return redirect(`/companies/${params.cnpj}/edit`);
    } catch (error) {
      if (error instanceof ValidationError) {
        return error.fieldErrors;
      }
      throw error;
    }
  };
}

export function getRemoveUserAction(axiosInstance: AxiosInstance) {
  return async function ({ params }: ActionFunctionArgs) {
    await removeUserFromCompany(axiosInstance, params.cnpj!, params.userId!);
    return redirect(`/companies/${params.cnpj}/edit`);
  };
}

type ConfirmActionDialogState = Omit<
  Parameters<typeof ConfirmActionDialog>[0],
  'open'
>;

export default function CompanyEditPage() {
  const company = useLoaderData() as Awaited<ReturnType<typeof getCompany>>;
  const {
    handleRepresentativeInputChange,
    handleInfoInputChange,
    handleAddressInputChange,
    handleSubmit,
    errors,
    submitting,
    fetchingCEP,
  } = useCompanyMutationForm(`/companies/${company.cnpj}/edit`, 'PUT');
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [confirmActionDialogState, setConfirmActionDialogState] =
    useState<ConfirmActionDialogState | null>(null);
  const [showAddUserFormDialog, setShowAddUserFormDialog] = useState(false);
  const fetcher =
    useFetcher<EnergizouRegistrations.RestAPI.ErrorResponseData>();

  const newUserErrors = fetcher.data as unknown as Record<
    string,
    string
  > | null;
  const users = company.users.filter(
    user => user.id !== (fetcher.json as Record<string, unknown>)?.userId,
  );
  const showConfirmActionDialog = Boolean(confirmActionDialogState);
  const updatingUsers = fetcher.state === 'submitting';

  function openConfirmActionDialog(props: ConfirmActionDialogState) {
    setConfirmActionDialogState(props);
  }

  function closeConfirmActionDialog() {
    setConfirmActionDialogState(null);
  }

  function openAddUserFormDialog() {
    setShowAddUserFormDialog(true);
  }

  function closeAddUserFormDialog() {
    setShowAddUserFormDialog(false);
  }

  function handleNewUserInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setNewUserForm({
      ...newUserForm,
      [event.target.name]: event.target.value,
    });
  }

  function handleNewUserFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetcher.submit(newUserForm, {
      method: 'POST',
      action: `users/add-user`,
      encType: 'application/json',
    });
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Edit fontSize="inherit" sx={{ mr: 1 }} /> Editar Cliente
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Form onSubmit={handleSubmit} id="company-edit-form">
            <CompanyMutationFormSectionGrid
              title="Representante"
              container
              spacing={2}
              sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Representante</InputLabel>
                  <Select
                    label="Representante"
                    onChange={handleRepresentativeInputChange}
                    fullWidth
                    name="representative">
                    {company.users.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </CompanyMutationFormSectionGrid>
            <CompanyMutationFormSectionGrid
              container
              spacing={2}
              title="Cadastro"
              sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="Razão Social"
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
                  disabled={submitting}
                  onChange={handleInfoInputChange}
                />
              </Grid>
            </CompanyMutationFormSectionGrid>
            <CompanyMutationFormSectionGrid
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
                  disabled={submitting}
                  onChange={handleAddressInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Rua"
                  name="street"
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
                  disabled={submitting || fetchingCEP}
                  onChange={handleAddressInputChange}
                />
              </Grid>
            </CompanyMutationFormSectionGrid>
            <CompanyMutationFormSectionGrid title={'Usuários'}>
              <Grid item xs={12}>
                <List disablePadding>
                  {users.map(user => (
                    <ListItem
                      key={user.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="Deletar usuário"
                          onClick={() =>
                            openConfirmActionDialog({
                              title: 'Remover usuário',
                              message:
                                'Tem certeza que deseja remover este usuário?',
                              confirmButton: (
                                <fetcher.Form
                                  method="POST"
                                  action={`users/${user.id}/remove-user`}>
                                  <Button
                                    type="submit"
                                    color="primary"
                                    name="userId"
                                    value={user.id}
                                    onClick={closeConfirmActionDialog}>
                                    Confirmar
                                  </Button>
                                </fetcher.Form>
                              ),
                              cancelButton: (
                                <Button
                                  color="warning"
                                  onClick={closeConfirmActionDialog}>
                                  Cancelar
                                </Button>
                              ),
                            })
                          }>
                          <Delete />
                        </IconButton>
                      }>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText>{user.email}</ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12}>
                <Button
                  startIcon={<Add />}
                  fullWidth
                  onClick={openAddUserFormDialog}>
                  Adicionar usuário
                </Button>
              </Grid>
            </CompanyMutationFormSectionGrid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() =>
                openConfirmActionDialog({
                  title: 'Salvar alterações',
                  message: 'Tem certeza que deseja salvar as alterações?',
                  confirmButton: (
                    <LoadingButton
                      loading={submitting}
                      type="submit"
                      form="company-edit-form"
                      color="primary">
                      Confirmar
                    </LoadingButton>
                  ),
                  cancelButton: (
                    <Button color="warning" onClick={closeConfirmActionDialog}>
                      Cancelar
                    </Button>
                  ),
                })
              }>
              Salvar
            </Button>
          </Form>
          {errors && (
            <FormErrorsAlert errors={errors as Record<string, string>} />
          )}
        </CardContent>
      </Card>
      <ConfirmActionDialog
        open={showConfirmActionDialog}
        {...confirmActionDialogState!}
      />
      <Dialog open={showAddUserFormDialog}>
        <DialogTitle>Adicionar usuário</DialogTitle>
        <DialogContent>
          <fetcher.Form
            onSubmit={handleNewUserFormSubmit}
            id="company-add-user-form">
            <TextField
              label="Nome"
              name="name"
              required
              autoFocus
              disabled={updatingUsers}
              error={Boolean(newUserErrors?.name)}
              helperText={newUserErrors?.name}
              sx={{ mb: 2, mt: 2 }}
              onChange={handleNewUserInputChange}
            />
            <TextField
              label="Email"
              name="email"
              required
              disabled={updatingUsers}
              error={Boolean(newUserErrors?.email)}
              helperText={newUserErrors?.email}
              sx={{ mb: 2 }}
              onChange={handleNewUserInputChange}
            />
            <TextField
              label="Senha"
              name="password"
              required
              type="password"
              disabled={updatingUsers}
              error={Boolean(newUserErrors?.password)}
              helperText={newUserErrors?.password}
              onChange={handleNewUserInputChange}
            />
          </fetcher.Form>
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={closeAddUserFormDialog}>
            Cancelar
          </Button>
          <LoadingButton
            loading={updatingUsers}
            type="submit"
            form="company-add-user-form"
            onClick={closeAddUserFormDialog}>
            Adicionar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
