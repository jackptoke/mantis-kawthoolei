import Page from 'components/Page';
import Layout from 'layout';
import { DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { useState, useCallback } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Snackbar,
  Switch,
  TextField
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CustomInputComponent from 'components/data-grids/CustomInputComponent';
import CustomSelectInputCell from 'components/data-grids/CustomSelectInputCell';
import { curriculums, governances } from 'data/kecd';
import { languages } from 'data/interior';

import { grade_levels } from 'data/kecd';
import VillageAddToolbar from 'components/data-grids/VillageAddToolbar';
import CustomSelectGovernanceInputCell from 'components/data-grids/CustomSelectGovernanceInputCell';
import CustomSelectInput from 'components/data-grids/CustomSelectInput';

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
  if (newRow.geo_latitude !== oldRow.geo_latitude) {
    return `Name from '${oldRow.geo_latitude}' to '${newRow.geo_latitude}'`;
  }
  if (newRow.geo_longitude !== oldRow.geo_longitude) {
    return `Name from '${oldRow.geo_longitude}' to '${newRow.geo_longitude}'`;
  }
  if (newRow.has_pta_committee !== oldRow.has_pta_committee) {
    return `Name from '${oldRow.has_pta_committee}' to '${newRow.has_pta_committee}'`;
  }
  if (newRow.has_dormitory !== oldRow.has_dormitory) {
    return `Name from '${oldRow.has_dormitory}' to '${newRow.has_dormitory}'`;
  }
  if (newRow.located_in_village !== oldRow.located_in_village) {
    return `Name from '${oldRow.located_in_village}' to '${newRow.located_in_village}'`;
  }
  if (newRow.language !== oldRow.language) {
    return `Name from '${oldRow.language}' to '${newRow.language}'`;
  }
  if (newRow.governance !== oldRow.governance) {
    return `Name from '${oldRow.governance}' to '${newRow.governance}'`;
  }
  if (newRow.txtGovernance !== oldRow.txtGovernance) {
    return `Name from '${oldRow.txtGovernance}' to '${newRow.txtGovernance}'`;
  }
  if (newRow.curriculum !== oldRow.curriculum) {
    return `Name from '${oldRow.curriculum}' to '${newRow.curriculum}'`;
  }
  if (newRow.from_grade !== oldRow.from_grade) {
    return `Name from '${oldRow.from_grade}' to '${newRow.from_grade}'`;
  }
  if (newRow.to_grade !== oldRow.to_grade) {
    return `Name from '${oldRow.to_grade}' to '${newRow.to_grade}'`;
  }
  if (newRow.district !== oldRow.district) {
    return `Name from '${oldRow.district}' to '${newRow.district}'`;
  }
  if (newRow.township !== oldRow.township) {
    return `Name from '${oldRow.township}' to '${newRow.township}'`;
  }
  if (newRow.village_tract !== oldRow.village_tract) {
    return `Name from '${oldRow.village_tract}' to '${newRow.village_tract}'`;
  }
  if (newRow.village !== oldRow.village) {
    return `Name from '${oldRow.village}' to '${newRow.village}'`;
  }
  return null;
}

const SchoolListPage = () => {
  const supabaseClient = useSupabaseClient();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const user = useUser();
  const [snackBar, setSnackbar] = useState(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    school_code: '',
    name_kar: '',
    name_bur: '',
    name_eng: '',
    geo_latitude: '',
    geo_longitude: '',
    has_pta_committee: false,
    has_dormitory: false,
    located_in_village: false,
    primary_language: '',
    school_governance: '',
    txtGovernance: '',
    curriculum: '',
    from_level: '',
    to_level: '',
    district: '',
    township: '',
    village_tract: '',
    village: ''
  });

  const [districts, setDistricts] = useState([]);
  const [townships, setTownships] = useState([]);
  const [villageTracts, setVillageTracts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [rowEditing, setRowEditing] = useState(null);

  useEffect(() => {
    async function loadSchools() {
      const { data } = await supabaseClient
        .from('Schools')
        .select('*, Villages(id, VillageTracts(id, Townships(id, Districts(id))))')
        .eq('deleted', false);
      setRows(data);
    }
    if (user) loadSchools();
  }, [user]);

  useEffect(() => {
    const getDistricts = async () => {
      const { data, error } = await supabaseClient.from('Districts').select('id, name_kar');
      console.log({ Districts: data });
      if (error) return;
      setDistricts(
        data.map((d) => {
          return { value: d.id, label: d.name_kar };
        })
      );
    };

    if (!rendered) {
      getDistricts();
      setRendered(true);
    }
  }, [rendered]);

  useEffect(() => {
    if (state.district) {
      getTownships();
      setState({ ...state, township: '', village_tract: '', village: '' });
    }
  }, [state.district]);

  useEffect(() => {
    if (state.township) {
      getVillageTracts();
      setState({ ...state, village_tract: '', village: '' });
    }
  }, [state.township]);

  useEffect(() => {
    if (state.village_tract) {
      getVillages();
      setState({ ...state, village: '' });
    }
  }, [state.village_tract]);

  const getTownships = async () => {
    if (state.district === '') return;

    const { data, error } = await supabaseClient
      .from('Townships')
      .select('id, name_kar, district_id')
      .eq('district_id', parseInt(state.district));
    console.log({ Townships: data });
    if (error) return;
    setTownships(
      data.map((t) => {
        return { value: t.id, label: t.name_kar };
      })
    );
  };

  const getVillageTracts = async () => {
    if (state.township === '') return;

    const { data, error } = await supabaseClient
      .from('VillageTracts')
      .select('id, name_kar, township_id')
      .eq('township_id', parseInt(state.township));
    console.log({ VillageTracts: data });
    if (error) return;
    setVillageTracts(
      data.map((vt) => {
        return { value: vt.id, label: vt.name_kar };
      })
    );
  };

  const getVillages = async () => {
    if (state.village_tract === '') return;
    const { data, error } = await supabaseClient
      .from('Villages')
      .select('id, name_kar, village_tract_id')
      .eq('village_tract_id', parseInt(state.village_tract));
    console.log({ Villages: data });
    if (error) return;
    setVillages(
      data.map((r) => {
        return { value: r.id, label: r.name_kar };
      })
    );
  };

  const customTextInputCell = (params) => {
    return <CustomInputComponent {...params} />;
  };

  const renderSelectVillageInputCell = (params) => {
    return <CustomSelectInputCell options={villages} {...params} />;
  };

  const renderSelectGovernanceInputCell = (params) => {
    return <CustomSelectGovernanceInputCell options={governances} {...params} />;
  };

  const columns = [
    { field: 'id', headerName: 'Id', width: 50, editable: false },
    { field: 'school_code', headerName: 'School Code', width: 100, editable: false },
    { field: 'name_kar', headerName: 'Name (Karen)', width: 200, editable: true, renderEditCell: customTextInputCell },
    { field: 'name_bur', headerName: 'Name(Burmese)', width: 200, editable: true, renderEditCell: customTextInputCell },
    { field: 'name_eng', headerName: 'Name(English)', width: 200, editable: true, renderEditCell: customTextInputCell },
    {
      field: 'from_level',
      headerName: 'Starting Grade',
      type: 'singleSelect',
      width: 150,
      editable: true,
      valueOptions: grade_levels.map((g) => g.value)
    },
    {
      field: 'to_level',
      headerName: 'Ending Grade',
      type: 'singleSelect',
      width: 150,
      editable: true,
      valueOptions: grade_levels.map((g) => g.value)
    },
    {
      field: 'primary_language',
      headerName: 'Primary Lang.',
      type: 'singleSelect',
      width: 75,
      editable: true,
      valueOptions: languages.map((l) => l.value)
    },
    {
      field: 'geo_latitude',
      headerName: 'Latitude',
      width: 100,
      editable: true
    },
    {
      field: 'geo_longitude',
      headerName: 'Longitude',
      width: 100,
      editable: true
    },
    {
      field: 'has_pta_committee',
      headerName: 'Has PTA',
      type: 'boolean',
      width: 75,
      editable: true
    },
    {
      field: 'located_in_village',
      headerName: 'Inside a Village?',
      type: 'boolean',
      width: 100,
      editable: true
    },
    {
      field: 'has_domitory',
      headerName: 'Has domitory?',
      type: 'boolean',
      width: 100,
      editable: true
    },
    {
      field: 'school_governance',
      headerName: 'Governance',
      type: 'singleSelect',
      width: 75,
      editable: true,
      renderEditCell: renderSelectGovernanceInputCell
    },
    {
      field: 'village_id',
      headerName: 'Village',
      type: 'singleSelect',
      width: 100,
      editable: true,
      renderEditCell: renderSelectVillageInputCell
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} color="inherit" key="edit" />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" key="delete" />
        ];
      }
    }
  ];

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleCellEditStart = (params, event) => {
    console.log({ Message: 'Cell Edit starts', Params: params });
    event.defaultMuiPrevented = true;
  };

  const handleCellEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
    console.log({ Message: 'Cell edit stops', Params: params });
  };

  const handleEditClick = (id) => async () => {
    setOpen(true);
    const row = rows.find((r) => r.id === id);
    console.log({ Clicked: id, RowData: row });

    setState({
      school_code: row.school_code,
      name_kar: row.name_kar,
      name_bur: row.name_bur,
      name_eng: row.name_eng,
      geo_latitude: row.geo_latitude,
      geo_longitude: row.geo_longitude,
      has_pta_committee: row.has_pta_committee,
      has_dormitory: row.has_dormitory,
      located_in_village: row.located_in_village,
      from_level: row.from_level,
      to_level: row.to_level,
      district: row.Villages.VillageTracts.Townships.Districts.id,
      township: row.Villages.VillageTracts.Townships.id,
      village_tract: row.Villages.VillageTracts.id,
      village: row.village_id,
      curriculum: row.curriculum,
      school_governance: row.school_governance === 'KECD' || row.school_governance === 'MoE' ? row.school_governance : 'Religious',
      txtGovernance: row.school_governance === 'KECD' || row.school_governance === 'MoE' ? '' : row.school_governance,
      primary_language: row.primary_language
    });

    setRowEditing(row);
  };

  const handleDeleteClick = (id) => async () => {
    console.log({ Clicked: id });
    deleteSubject(id);
  };

  const deleteSubject = async (id) => {
    const { error } = await supabaseClient.from('Schools').update({ deleted: true }).eq('id', id);
    if (!error) {
      setSnackbar({ children: 'Subject successfully deleted', severity: 'success' });
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = useCallback(
    async (newRow, oldRow) => {
      // Make the HTTP request to save in the backend
      const mutation = computeMutation(newRow, oldRow);
      if (mutation) {
        console.log({ Saving: newRow });
        const { data, error } = await supabaseClient.from('Schools').update(newRow).eq('id', newRow.id).select();
        if (error) return oldRow;
        console.log({ dataReturned: data });
        setSnackbar({ children: 'Student successfully saved', severity: 'success' });
        return data;
      }

      return newRow;
    },
    [rows]
  );

  const processRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleSave = async () => {
    const school = {
      school_code: state.school_code,
      name_kar: state.name_kar,
      name_bur: state.name_bur,
      name_eng: state.name_eng,
      geo_latitude: state.geo_latitude,
      geo_longitude: state.geo_longitude,
      has_pta_committee: state.has_pta_committee,
      has_dormitory: state.has_dormitory,
      located_in_village: state.located_in_village,
      from_level: state.from_level,
      to_level: state.to_level,
      village_id: state.village_id,
      curriculum: state.curriculum,
      school_governance:
        state.school_governance === 'KECD' || state.school_governance === 'MoE' ? state.school_governance : state.txtGovernance,
      primary_language: state.primary_language
    };

    console.log({ School: school });

    const { data, error } = await supabaseClient.from('Schools').update(school).eq('id', rowEditing.id).select();
    if (!error) setRows([...rows.filter((r) => r.id !== rowEditing.id), data[0]]);
    setOpen(false);
    setRowEditing(null);
  };

  const handleClose = () => {
    setOpen(false);
    setRowEditing(null);
  };

  const handleValueChange = (event) => {
    console.log({ Name: event });
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSwitchChange = (event) => {
    console.log({ Check: event.target.checked, Name: event.target.name, Value: event.target.value });
    setState({ ...state, [event.target.name]: event.target.checked });
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
          editedRow="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleCellEditStart}
          onRowEditStop={handleCellEditStop}
          onCellEditStart={handleCellEditStart}
          onCellEditStop={handleCellEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={processRowUpdateError}
          slots={{ toolbar: VillageAddToolbar }}
          slotProps={{ toolbar: { setRowModesModel, setRows, rows, setSnackbar } }}
          getRowHeight={() => 75}
          autoHeight
          columnVisibilityModel={{ id: false }}
        />
        {!!snackBar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackBar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit School Detail</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: 3 }}>
              <FormGroup row>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <TextField
                      id="txtSchoolCode"
                      name="school_code"
                      label="School Code"
                      value={state.school_code}
                      onChange={handleValueChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="txtNameKar"
                      name="name_kar"
                      label="Name (Kar)"
                      value={state.name_kar}
                      onChange={handleValueChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="txtNameBur"
                      name="name_bur"
                      label="Name (Bur)"
                      value={state.name_bur}
                      onChange={handleValueChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="txtNameEng"
                      name="name_eng"
                      label="Name (Eng)"
                      value={state.name_eng}
                      onChange={handleValueChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="geoLatitude"
                      name="geo_latitude"
                      label="Geo Latitude"
                      value={state.geo_latitude}
                      onChange={handleValueChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="geoLongitude"
                      name="geo_longitude"
                      label="Geo Longitude"
                      value={state.geo_longitude}
                      onChange={handleValueChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.has_pta_committee}
                          onChange={handleSwitchChange}
                          name="has_pta_committee"
                          value={state.has_pta_committee}
                        />
                      }
                      label="Has PTA"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.has_dormitory}
                          value={state.has_dormitory}
                          onChange={handleSwitchChange}
                          name="has_dormitory"
                        />
                      }
                      label="Has Domitory"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.located_in_village}
                          value={state.located_in_village}
                          onChange={handleSwitchChange}
                          name="located_in_village"
                        />
                      }
                      label="Located inside a village?"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="from_level"
                      key={'from-grade-select'}
                      label="From Grade"
                      value={state.from_level}
                      setValue={(value) => {
                        console.log({ value });
                        setState({ ...state, from_level: value });
                      }}
                      options={grade_levels}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="to_level"
                      key={'to-grade-select'}
                      label="To Grade"
                      value={state.to_level}
                      setValue={(value) => {
                        setState({ ...state, to_level: value });
                      }}
                      options={grade_levels}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="district"
                      key={'district-select'}
                      label="District"
                      value={state.district}
                      setValue={(value) => {
                        console.log({ value });
                        setState({ ...state, district: value });
                      }}
                      options={districts}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="township"
                      key={'township-select'}
                      label="Township"
                      value={state.township}
                      setValue={(value) => {
                        setState({ ...state, township: value });
                      }}
                      options={townships}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="village_tract"
                      key={'village-tract-select'}
                      label="Village Tract"
                      value={state.village_tract}
                      setValue={(value) => {
                        setState({ ...state, village_tract: value });
                      }}
                      options={villageTracts}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="village"
                      key={'village-select'}
                      label="Village"
                      value={state.village}
                      setValue={(value) => {
                        setState({ ...state, village: value });
                      }}
                      options={villages}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="curriculum"
                      key={'curriculum-select'}
                      label="Curriculum"
                      value={state.curriculum}
                      setValue={(value) => {
                        setState({ ...state, curriculum: value });
                      }}
                      options={curriculums}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="school_governance"
                      key={'governance-select'}
                      label="Governance"
                      value={state.school_governance}
                      setValue={(value) => {
                        setState({ ...state, school_governance: value });
                      }}
                      options={governances}
                    />
                  </Grid>
                  {state.school_governance === 'Religious' ? (
                    <Grid item xs={3}>
                      <TextField
                        id="txtGovernance"
                        name="txtGovernance"
                        label="Governance"
                        value={state.txtGovernance}
                        onChange={handleValueChange}
                        disabled={state.school_governance !== 'Religious'}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}

                  <Grid item xs={3}>
                    <CustomSelectInput
                      name="primary_language"
                      key={'language-select'}
                      label="Language"
                      value={state.primary_language}
                      setValue={(value) => {
                        setState({ ...state, primary_language: value });
                      }}
                      options={languages}
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Page>
  );
};

SchoolListPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SchoolListPage;
