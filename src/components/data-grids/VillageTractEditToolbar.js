import { useState } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

function VillageTractEditToolbar(props) {
  const supabase = useSupabaseClient();
  const { rows, setRows, setSnackbar } = props;
  const [nameKar, setNameKar] = useState('');
  const [nameBur, setNameBur] = useState('');
  const [nameEng, setNameEng] = useState('');
  const [township, setTownship] = useState('');
  const [townships, setTownships] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const getDistricts = async () => {
      const { data, error } = await supabase.from('Townships').select('id, name_kar');
      if (data && !error) {
        setTownships(data);
        setTownship(data[0].id);
      }
    };
    if (!rendered) {
      getDistricts();
      setRendered(true);
    }
  }, [townships, rendered]);

  const handleClick = async () => {
    console.log('Clicked');
    if (nameKar.trim().length === 0 || nameBur.trim().length === 0 || nameEng.trim().length === 0) {
      setSnackbar({ children: 'One or more field is empty', severity: 'error' });
      return;
    }

    const newVillageTract = { name_kar: nameKar, name_bur: nameBur, name_eng: nameEng, township_id: township };

    const { data, error } = await supabase.from('VillageTracts').insert(newVillageTract).select();

    if (error) {
      setSnackbar({ children: 'Village tract add unsuccessfully', severity: 'error' });
      return;
    }

    if (data) {
      setRows([...rows, data[0]]);
      setSnackbar({ children: 'Village tract successfully saved', severity: 'success' });
      setNameBur('');
      setNameKar('');
      setNameEng('');
      setTownship(townships[0].id);
    }
  };

  return (
    <GridToolbarContainer>
      <TextField
        id="txtNameKar"
        label="Name (Kar)"
        value={nameKar}
        onChange={(e) => {
          console.log({ NameKar: e.target.value });
          setNameKar(e.target.value);
        }}
        required
      />
      <TextField
        id="txtNameBur"
        label="Name (Bur)"
        value={nameBur}
        onChange={(e) => {
          console.log({ NameKar: e.target.value });
          setNameBur(e.target.value);
        }}
        required
      />
      <TextField
        id="txtNameEng"
        label="Name (Eng)"
        value={nameEng}
        onChange={(e) => {
          console.log({ NameKar: e.target.value });
          setNameEng(e.target.value);
        }}
        required
      />
      <Select
        id="selectGradeLevels"
        value={township}
        onChange={(e) => {
          console.log({ Selected: e.target.value });
          setTownship(e.target.value);
        }}
      >
        {townships.map((i) => (
          <MenuItem key={i.id} value={i.id} selected={i.id === townships[0].id ? true : false}>
            {i.name_kar}
          </MenuItem>
        ))}
      </Select>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

VillageTractEditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired
};

export default VillageTractEditToolbar;
