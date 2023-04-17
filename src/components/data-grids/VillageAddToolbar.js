import { useState } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { Button, FormControlLabel, FormGroup, Grid, Paper, Switch, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { grade_levels, governances, curriculums } from 'data/kecd';
import { useEffect } from 'react';
import CustomSelectInput from './CustomSelectInput';
import { languages } from 'data/interior';

function VillageAddToolbar(props) {
  const supabase = useSupabaseClient();
  const { rows, setRows, setSnackbar } = props;
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
    language: '',
    governance: '',
    txtGovernance: '',
    curriculum: '',
    from_grade: '',
    to_grade: '',
    district: '',
    township: '',
    village_tract: '',
    village: ''
  });

  const handleValueChange = (event) => {
    console.log({ Name: event });
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSwitchChange = (event) => {
    console.log({ Check: event.target.checked, Name: event.target.name, Value: event.target.value });
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [districts, setDistricts] = useState([]);
  const [townships, setTownships] = useState([]);
  const [villageTracts, setVillageTracts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [rendered, setRendered] = useState(false);

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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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
    const { data, error } = await supabase
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

  useEffect(() => {
    const getDistricts = async () => {
      const { data, error } = await supabase.from('Districts').select('id, name_kar');
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

  const handleClick = async () => {
    if (
      state.school_code.trim() === '' ||
      state.name_kar.trim().length === 0 ||
      state.name_bur.trim().length === 0 ||
      state.name_eng.trim().length === 0 ||
      state.district === '' ||
      state.township === '' ||
      state.village_tract === '' ||
      state.village === '' ||
      state.from_grade === '' ||
      state.to_grade === ''
    ) {
      setSnackbar({ children: 'One or more field is empty', severity: 'error' });
      return;
    }

    const newSchool = {
      school_code: state.school_code.trim(),
      name_kar: state.name_kar.trim(),
      name_bur: state.name_bur.trim(),
      name_eng: state.name_eng.trim(),
      geo_latitude: parseFloat(state.geo_latitude.trim()),
      geo_longitude: parseFloat(state.geo_longitude.trim()),
      has_pta_committee: state.has_pta_committee,
      has_dormitory: state.has_dormitory,
      located_in_village: state.located_in_village,
      from_level: state.from_grade,
      to_level: state.to_grade,
      school_governance: state.governance === 'Religious' ? state.txtGovernance : state.governance,
      curriculum: state.curriculum,
      primary_language: state.language,
      village_id: parseInt(state.village)
    };

    const { data, error } = await supabase.from('Schools').insert(newSchool).select();

    if (error) {
      setSnackbar({ children: 'Student add unsuccessfully', severity: 'error' });
      return;
    }

    if (data) {
      setRows([...rows, data[0]]);

      setSnackbar({ children: 'Student successfully saved', severity: 'success' });
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <GridToolbarContainer>
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
              <TextField id="txtNameKar" name="name_kar" label="Name (Kar)" value={state.name_kar} onChange={handleValueChange} required />
            </Grid>
            <Grid item xs={3}>
              <TextField id="txtNameBur" name="name_bur" label="Name (Bur)" value={state.name_bur} onChange={handleValueChange} required />
            </Grid>
            <Grid item xs={3}>
              <TextField id="txtNameEng" name="name_eng" label="Name (Eng)" value={state.name_eng} onChange={handleValueChange} required />
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
                  <Switch checked={state.has_dormitory} value={state.has_dormitory} onChange={handleSwitchChange} name="has_dormitory" />
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
                value={state.from_grade}
                setValue={(value) => {
                  console.log({ value });
                  setState({ ...state, from_grade: value });
                }}
                options={grade_levels}
              />
            </Grid>
            <Grid item xs={3}>
              <CustomSelectInput
                name="to_level"
                key={'to-grade-select'}
                label="To Grade"
                value={state.to_grade}
                setValue={(value) => {
                  setState({ ...state, to_grade: value });
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
                name="governance"
                key={'governance-select'}
                label="Governance"
                value={state.governance}
                setValue={(value) => {
                  setState({ ...state, governance: value });
                }}
                options={governances}
              />
            </Grid>
            {state.governance === 'Religious' ? (
              <Grid item xs={3}>
                <TextField
                  id="txtGovernance"
                  name="txtGovernance"
                  label="Governance"
                  value={state.txtGovernance}
                  onChange={handleValueChange}
                  disabled={state.governance !== 'Religious'}
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={3}>
              <CustomSelectInput
                name="language"
                key={'language-select'}
                label="Language"
                value={state.language}
                setValue={(value) => {
                  setState({ ...state, language: value });
                }}
                options={languages}
              />
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleClick()}>
                Add record
              </Button>
            </Grid>
          </Grid>
        </FormGroup>
      </GridToolbarContainer>
    </Paper>
  );
}

VillageAddToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired
};

export default VillageAddToolbar;
