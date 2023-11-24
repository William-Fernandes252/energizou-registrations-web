import CompaniesTable from '@/components/CompaniesTable';
import PageTitleBox from '@/components/PageTitleBox';
import { Alert, Box, Grid } from '@mui/material';
import { getCompanies } from '@/models/company';
import {
  useLoaderData,
  useRouteError,
  useSearchParams,
} from 'react-router-dom';

export async function companiesLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 1;
  const limit = url.searchParams.get('limit') || 20;
  const sort = (url.searchParams.get('sort') ||
    'reason') as EnergizouRegistrations.RestAPI.CompanySortableField;
  const order = url.searchParams.get('order') as 'ASC' | 'DESC';
  return await getCompanies(Number(page), Number(limit), { sort, order });
}

export default function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams({
    sort: 'reason',
    order: 'ASC',
  } as {
    sort: keyof Pick<
      EnergizouRegistrations.Models.Company,
      'reason' | 'created'
    >;
    order: 'ASC' | 'DESC';
  });
  const data = useLoaderData() as Awaited<ReturnType<typeof companiesLoader>>;
  const error: unknown | null = useRouteError();

  const paginationModel = {
    page: Number(searchParams.get('page') || 1),
    pageSize: Number(searchParams.get('limit') || 20),
  };

  function handlePaginationModelChange(newPaginationModel: {
    page: number;
    pageSize: number;
  }) {
    setSearchParams({
      page: newPaginationModel.page.toString(),
      limit: newPaginationModel.pageSize.toString(),
      sort: searchParams.get('sort') || 'reason',
      order: searchParams.get('order') || 'ASC',
    });
  }

  let content: JSX.Element;
  if (error instanceof Error) {
    content = <Alert severity="error">{error.message}</Alert>;
  } else {
    content = (
      <CompaniesTable
        companies={data.items}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        totalCompaniesCount={data.meta.totalItems}
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
