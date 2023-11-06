import { Box, Paper } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridEventListener,
  GridRowEditStopReasons,
  type GridRowId,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useCompany } from '@/models/company';

type Props = {
  companies: EnergizouRegistrations.Models.Company[];
  isLoading: boolean;
  onCreate: (product: EnergizouRegistrations.Models.Company) => void;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => void;
  count: number;
  onSelected: (company: EnergizouRegistrations.Models.Company) => void;
};

export default function CompaniesTable({
  companies,
  isLoading,
  paginationModel,
  onPaginationModelChange,
  count,
  onSelected,
}: Props) {
  const rows = [
    ...companies,
  ] as Partial<EnergizouRegistrations.Models.Company>[];
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { delete: deleteProduct } = useCompany();
  const [selected, setSelected] =
    useState<EnergizouRegistrations.Models.Company | null>(null);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    return deleteProduct(id.toString());
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'cnpj', headerName: 'CNPJ', flex: 1 },
    { field: 'reason', headerName: 'Razão Social', flex: 1 },
    {
      field: 'phone',
      headerName: 'Telefone',
      flex: 1,
    },
    { field: 'representative', headerName: 'Representante', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
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
              paginationModel: paginationModel,
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
          onRowSelectionModelChange={newSelectedRow => {
            if (newSelectedRow.length > 0) {
              onSelected(
                rows.find(
                  company => company.cnpj === newSelectedRow[0],
                ) as EnergizouRegistrations.Models.Company,
              );
            }
          }}
          rowSelectionModel={selected ? [selected.cnpj] : []}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          rowCount={count}
          loading={isLoading}
        />
      </Box>
    </Paper>
  );
}
