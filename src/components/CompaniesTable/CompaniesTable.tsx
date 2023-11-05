import { Box, Button, Paper } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridEventListener,
  GridRowEditStopReasons,
  type GridRowId,
  type GridRowModel,
  GridRowModes,
  GridRowModesModel,
  type GridRowsProp,
  GridToolbarContainer,
  type GridRowSelectionModel,
} from '@mui/x-data-grid';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { useState } from 'react';
import { useCompany } from '@/models/company';

type EditToolbarProps = {
  setRows: (
    newRows: (
      oldRows: GridRowsProp<EnergizouRegistrations.Models.Company>,
    ) => GridRowsProp<EnergizouRegistrations.Models.Company>,
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  rowsSelected: GridRowSelectionModel;
  onDeleteSeleted: (ids: GridRowId[]) => void;
};

function EditToolbar({ setRows, setRowModesModel }: EditToolbarProps) {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />}>
        Add Product
      </Button>
    </GridToolbarContainer>
  );
}

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
};

export default function CompaniesTable({
  companies,
  isLoading,
  paginationModel,
  onPaginationModelChange,
  count,
}: Props) {
  const [rows, setRows] = useState<
    Partial<EnergizouRegistrations.Models.Company>[]
  >([...companies]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { delete: deleteProduct } = useCompany();

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
          checkboxSelection
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              setRowModesModel,
              setRows,
            },
          }}
          rowCount={count}
          loading={isLoading}
        />
      </Box>
    </Paper>
  );
}
