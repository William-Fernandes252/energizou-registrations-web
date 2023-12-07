import { Box, Button, Paper } from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  type GridColDef,
  useGridApiContext,
} from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { Add, FileDownload } from '@mui/icons-material';
import { formatCnpj, formatPhoneNumber } from '@/utils/format';

type Props = {
  companies: EnergizouRegistrations.Models.CompanyPreview[];
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => void;
  totalCompaniesCount: number;
};

function Toolbar() {
  const apiRef = useGridApiContext();
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<Add />}
        component={Link}
        to="/companies/new">
        Cadastrar cliente
      </Button>
      <Button
        onClick={() => apiRef.current.exportDataAsCsv({ fileName: 'clientes' })}
        startIcon={<FileDownload />}>
        Exportar
      </Button>
    </GridToolbarContainer>
  );
}

export default function CompanyTable({
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
      valueFormatter: ({ value }) => formatCnpj(value),
    },
    { field: 'reason', headerName: 'Razão Social', flex: 1 },
    {
      field: 'phone',
      headerName: 'Telefone',
      flex: 1,
      valueFormatter: ({ value }) =>
        formatPhoneNumber(value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')),
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
            slots={{
              toolbar: Toolbar,
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
