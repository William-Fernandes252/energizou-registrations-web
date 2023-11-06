import CompaniesTable from '@/components/CompaniesTable';
import PageTitleBox from '@/components/PageTitleBox';
import CompanyDetailsDialog from '@/components/CompanyDetailsDialog';
import { useCompanies, useCompany } from '@/models/company';
import { Alert, Box, Grid, LinearProgress } from '@mui/material';
import { useState } from 'react';

export default function CompaniesPage() {
  const [params] = useState<{
    sort: keyof Pick<
      EnergizouRegistrations.Models.Company,
      'reason' | 'created'
    >;
    order: 'ASC' | 'DESC';
  }>({ sort: 'reason', order: 'ASC' });
  const [selected, setSelected] =
    useState<EnergizouRegistrations.Models.Company | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 20,
  });
  const {
    data: products,
    isLoading,
    create,
    error,
  } = useCompanies(paginationModel.page, paginationModel.pageSize, params);
  const { delete: deleteCompany } = useCompany();

  function handlePaginationModelChange(newPaginationModel: {
    page: number;
    pageSize: number;
  }) {
    if (
      newPaginationModel.page !== paginationModel.page &&
      newPaginationModel.page > 0
    ) {
      setPaginationModel(newPaginationModel);
    }
  }

  function handleClose() {
    setSelected(null);
  }

  let content: JSX.Element;
  if (error) {
    content = (
      <Alert severity="error">
        {error?.response
          ? error.response.data.detail
          : 'An error occurred during the fetch.'}
      </Alert>
    );
  } else {
    content = isLoading ? (
      <LinearProgress />
    ) : (
      <CompaniesTable
        companies={products.results}
        isLoading={isLoading}
        onCreate={create}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        count={products.count}
        onSelected={company => {
          setSelected(company);
        }}
      />
    );
  }

  return (
    <>
      <PageTitleBox title="Clientes" />
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {content}
          </Grid>
        </Grid>
      </Box>
      <CompanyDetailsDialog
        onClose={handleClose}
        company={selected}
        onDelete={deleteCompany}
      />
    </>
  );
}
