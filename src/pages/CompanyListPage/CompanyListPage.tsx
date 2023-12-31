import CompanyTable from '@/components/CompanyTable';
import PageTitleBox from '@/components/PageTitleBox';
import { Alert, Box, Grid } from '@mui/material';
import { getCompanies } from '@/models/company';
import {
  type LoaderFunctionArgs,
  useLoaderData,
  useOutlet,
  useRouteError,
  useSearchParams,
} from 'react-router-dom';
import type { AxiosInstance } from 'axios';

export function getCompaniesLoader(axiosInstance: AxiosInstance) {
  return async function ({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    return await getCompanies(axiosInstance, params);
  };
}

export default function CompanyListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof getCompaniesLoader>>
  >;
  const error: unknown | null = useRouteError();
  const outlet = useOutlet();

  const paginationModel = {
    page: Number(searchParams.get('page') || 1),
    pageSize: Number(searchParams.get('limit') || 20),
  };

  function handlePaginationModelChange(newPaginationModel: {
    page: number;
    pageSize: number;
  }) {
    if (newPaginationModel.page < 1) {
      newPaginationModel.page = 1;
    }
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: newPaginationModel.page.toString(),
      limit: newPaginationModel.pageSize.toString(),
    });
  }

  function handleSearch(search: string) {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      search,
    });
  }

  let content: JSX.Element;
  if (error instanceof Error) {
    content = <Alert severity="error">{error.message}</Alert>;
  } else {
    content = (
      <CompanyTable
        companies={data.items}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        totalCompaniesCount={data.meta.totalItems}
        onSearch={handleSearch}
      />
    );
  }

  return (
    <>
      <PageTitleBox title="Clientes" />
      <Box>
        <Grid container spacing={2}>
          <Grid item md={outlet ? 8 : 12}>
            {content}
          </Grid>
          {outlet && (
            <Grid item md={4} sm={12}>
              {outlet}
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
