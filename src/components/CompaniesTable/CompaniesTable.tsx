import { Box, Paper } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { cnpj } from 'cpf-cnpj-validator';

type Props = {
  companies: EnergizouRegistrations.Models.CompanyPreview[];
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => void;
  totalCompaniesCount: number;
};

export default function CompaniesTable({
  companies,
  paginationModel,
  onPaginationModelChange,
  totalCompaniesCount: count,
}: Props) {
  const navigate = useNavigate();

  const rows = [
    ...companies,
  ] as Partial<EnergizouRegistrations.Models.CompanyPreview>[];
  const columns: GridColDef[] = [
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      flex: 1,
      valueFormatter: ({ value }) => cnpj.format(value),
    },
    { field: 'reason', headerName: 'Razão Social', flex: 1 },
    {
      field: 'phone',
      headerName: 'Telefone',
      flex: 1,
      valueFormatter: ({ value }) =>
        value.replace(/(\d{1,2})(\d{4})(\d{4})/, '+55 ($1) $2-$3'),
    },
    { field: 'representative', headerName: 'Representante', flex: 1 },
  ];

  return (
    <>
      <Paper>
        <Box
          sx={{
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}>
          <DataGrid
            rows={rows as EnergizouRegistrations.Models.Company[]}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            pageSizeOptions={[
              { value: 20, label: '20' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
              { value: count, label: 'All' },
            ]}
            onPaginationModelChange={onPaginationModelChange}
            paginationMode="server"
            editMode="row"
            onRowSelectionModelChange={row => {
              if (row.length > 0) {
                navigate(`/companies/${row[0]}`);
              }
            }}
            autoHeight
            getRowId={row => row.cnpj}
            rowCount={count}
          />
        </Box>
      </Paper>
    </>
  );
}
