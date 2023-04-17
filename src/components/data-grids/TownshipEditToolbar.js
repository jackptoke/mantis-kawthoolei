import { useState } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

function TownshipEditToolbar(props) {
  const supabase = useSupabaseClient();
  const { rows, setRows, setSnackbar } = props;
  const [nameKar, setNameKar] = useState('');
  const [nameBur, setNameBur] = useState('');
  const [nameEng, setNameEng] = useState('');
  const [district, setDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const getDistricts = async () => {
      const { data, error } = await supabase.from('Districts').select('id, name_kar');
      if (data && !error) {
        setDistricts(data);
        setDistrict(data[0].id);
      }
    };
    if (!rendered) {
      getDistricts();
      setRendered(true);
    }
  }, [districts, rendered]);

  const handleClick = async () => {
    console.log('Clicked');
    if (nameKar.trim().length === 0 || nameBur.trim().length === 0 || nameEng.trim().length === 0) {
      setSnackbar({ children: 'One or more field is empty', severity: 'error' });
      return;
    }

    const newTownship = { name_kar: nameKar, name_bur: nameBur, name_eng: nameEng, district_id: district };
    console.log({ newTownship: newTownship });

    const { data, error } = await supabase.from('Townships').insert(newTownship).select();

    if (error) {
      setSnackbar({ children: 'Township add unsuccessfully', severity: 'error' });
      return;
    }

    if (data) {
      setRows([...rows, data[0]]);
      setSnackbar({ children: 'Township successfully saved', severity: 'success' });
      setNameBur('');
      setNameKar('');
      setNameEng('');
      setDistrict(districts[0].id);
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
        value={district}
        onChange={(e) => {
          console.log({ Selected: e.target.value });
          setDistrict(e.target.value);
        }}
      >
        {districts.map((i) => (
          <MenuItem key={i.id} value={i.id} selected={i.id === districts[0].id ? true : false}>
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

TownshipEditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired
};

export default TownshipEditToolbar;
