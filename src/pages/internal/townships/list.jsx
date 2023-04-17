import Page from 'components/Page';
import Layout from 'layout';
import { GridRowModes, DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { useState, useCallback } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomInputComponent from 'components/data-grids/CustomInputComponent';
import TownshipEditToolbar from 'components/data-grids/TownshipEditToolbar';
import SelectDistrictInputCell from 'components/data-grids/SelectDistrictInputCell';

const renderSelectDistrictInputCell = (params) => {
  return <SelectDistrictInputCell {...params} />;
};

function computeMutation(newRow, oldRow) {
  if (newRow.name_kar !== oldRow.name_kar) {
    return `Name from '${oldRow.name_kar}' to '${newRow.name_kar}'`;
  }
  if (newRow.name_bur !== oldRow.name_bur) {
    return `Name from '${oldRow.name_bur}' to '${newRow.name_bur}'`;
  }
  if (newRow.name_eng !== oldRow.name_eng) {
    return `Name from '${oldRow.name_eng}' to '${newRow.name_eng}'`;
  }
  if (newRow.district_id !== oldRow.district_id) {
    return `Name from '${oldRow.district_id}' to '${newRow.district_id}'`;
  }

  return null;
}

const useUpdateTownship = () => {
  const supabaseClient = useSupabaseClient();
  return useCallback(async (township) => {
    const newData = {
      name_kar: township.name_kar,
      name_bur: township.name_bur,
      name_eng: township.name_eng,
      district_id: parseInt(township.district_id)
    };

    const { data, error } = await supabaseClient.from('Townships').update(newData).eq('id', township.id).select();
    if (!error) return data;
    return null;
  }, []);
};

const TownshipListPage = () => {
  const supabaseClient = useSupabaseClient();
  const [rows, setRows] = useState([]);
  const updateTownship = useUpdateTownship();
  const [rowModesModel, setRowModesModel] = useState({});
  const user = useUser();
  const [snackBar, setSnackbar] = useState(null);

  const customTextInputCell = (params) => {
    return <CustomInputComponent {...params} />;
  };

  const columns = [
    { field: 'id', headerName: 'Id', width: 50, editable: false },
    { field: 'name_kar', headerName: 'Name (Karen)', width: 200, editable: true, renderEditCell: customTextInputCell },
    { field: 'name_bur', headerName: 'Name(Burmese)', width: 200, editable: true, renderEditCell: customTextInputCell },
    { field: 'name_eng', headerName: 'Name(English)', width: 200, editable: true },
    { field: 'district_id', headerName: 'District', width: 200, editable: true, renderEditCell: renderSelectDistrictInputCell },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              className="textPrimary"
              onClick={handleSaveClick(id)}
              color="inherit"
              key="save"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key="cancel"
            />
          ];
        }

        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} color="inherit" key="edit" />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" key="delete" />
        ];
      }
    }
  ];

  useEffect(() => {
    async function loadSubject() {
      const { data } = await supabaseClient.from('Townships').select('*');
      setRows(data);
    }
    if (user) loadSubject();
  }, [user]);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleCellEditStart = (params, event) => {
    console.log({ Message: 'Cell Edit starts', Params: params });
    event.defaultMuiPrevented = true;
  };

  const handleCellEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
    console.log({ Message: 'Cell edit stops', Params: params });
  };

  const deleteSubject = async (id) => {
    const { error } = await supabaseClient.from('Townships').delete().eq('id', id);
    if (!error) {
      setSnackbar({ children: 'Township successfully deleted', severity: 'success' });
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleEditClick = (id) => async () => {
    console.log({ Clicked: id });
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name_kar' } });
  };

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    console.log({ Clicked: id });
    deleteSubject(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });
  };

  const processRowUpdate = async (newRow, oldRow) => {
    // Make the HTTP request to save in the backend
    const mutation = computeMutation(newRow, oldRow);
    if (mutation) {
      const result = await updateTownship(newRow);

      if (result) {
        setRows(rows.map((row) => (row.id === result[0].id ? result[0] : row)));
        setSnackbar({ children: 'Townships successfully saved', severity: 'success' });
        return result[0];
      }
    }

    return oldRow;
  };

  const processRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  return (
    <Page title="Subjects List">
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary'
          },
          '& .textPrimary': {
            color: 'text.primary'
          }
        }}
      >
        <DataGridPro
          columns={columns}
          rows={rows}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleCellEditStart}
          onRowEditStop={handleCellEditStop}
          onCellEditStart={handleCellEditStart}
          onCellEditStop={handleCellEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={processRowUpdateError}
          slots={{ toolbar: TownshipEditToolbar }}
          slotProps={{ toolbar: { setRowModesModel, setRows, rows, setSnackbar } }}
          getRowHeight={() => 75}
          autoHeight
        />
        {!!snackBar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackBar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </Box>
    </Page>
  );
};

TownshipListPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default TownshipListPage;
