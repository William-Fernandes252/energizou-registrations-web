import CompaniesTable from '@/components/CompaniesTable';
import PageTitleBox from '@/components/PageTitleBox';
import { useCompanies } from '@/models/company';
import { Alert, Box, Grid, LinearProgress } from '@mui/material';
import { useState } from 'react';

export default function CompaniesPage() {
  const [params] = useState({ name: '', description: '' });
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
    </>
  );
}
