import { Box, Button, Paper } from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  type GridColDef,
  useGridApiContext,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { Add, FileDownload } from '@mui/icons-material';
import { formatCnpj, formatPhoneNumber } from '@/utils/format';
import type { KeyboardEvent } from 'react';

type ToolBarProps = {
  onSearch: (search: string) => void;
};

function Toolbar({ onSearch }: ToolBarProps) {
  const apiRef = useGridApiContext();

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch((event.target as HTMLInputElement).value);
    }
  }

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
      <GridToolbarQuickFilter
        placeholder="Pressione ENTER"
        onKeyDown={handleSearchKeyDown}
      />
    </GridToolbarContainer>
  );
}

export type CompanyTableProps = {
  companies: EnergizouRegistrations.Models.CompanyPreview[];
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => void;
  onSearch: ToolBarProps['onSearch'];
  totalCompaniesCount: number;
};

export default function CompanyTable({
  companies,
  paginationModel,
  onPaginationModelChange,
  totalCompaniesCount: count,
  onSearch,
}: CompanyTableProps) {
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
    {
      field: 'reason',
      headerName: 'Razão Social',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Telefone',
      flex: 1,
      valueFormatter: ({ value }) =>
        formatPhoneNumber(value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')),
    },
    {
      field: 'representative',
      headerName: 'Representante',
      flex: 1,
      valueFormatter: ({ value }) => value?.email,
    },
  ];

  return (
    <Box
      sx={{
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        height: '512px',
      }}
      component={Paper}>
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
        getRowId={row => row.cnpj}
        rowCount={count}
        slots={{
          toolbar: Toolbar,
        }}
        slotProps={{
          toolbar: {
            onSearch,
          },
        }}
        sx={{ height: '100%' }}
        filterMode="server"
        disableColumnFilter
      />
    </Box>
  );
}
