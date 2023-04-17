import { useState } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

function VillageEditToolbar(props) {
  const supabase = useSupabaseClient();
  const { rows, setRows, setSnackbar } = props;
  const [nameKar, setNameKar] = useState('');
  const [nameBur, setNameBur] = useState('');
  const [nameEng, setNameEng] = useState('');
  const [villageTract, setVillageTract] = useState('');
  const [villageTracts, setVillageTracts] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const getDistricts = async () => {
      const { data, error } = await supabase.from('VillageTracts').select('id, name_kar');
      if (data && !error) {
        setVillageTracts(data);
        setVillageTract(data[0].id);
      }
    };

    if (!rendered) {
      getDistricts();
      setRendered(true);
    }
  }, [villageTracts, rendered]);

  const handleClick = async () => {
    console.log('Clicked');
    if (nameKar.trim().length === 0 || nameBur.trim().length === 0 || nameEng.trim().length === 0) {
      setSnackbar({ children: 'One or more field is empty', severity: 'error' });
      return;
    }

    const newVillage = { name_kar: nameKar, name_bur: nameBur, name_eng: nameEng, village_tract_id: villageTract };

    const { data, error } = await supabase.from('Villages').insert(newVillage).select();

    if (error) {
      setSnackbar({ children: 'Village add unsuccessfully', severity: 'error' });
      return;
    }

    if (data) {
      setRows([...rows, data[0]]);
      setSnackbar({ children: 'Village successfully saved', severity: 'success' });
      setNameBur('');
      setNameKar('');
      setNameEng('');
      setVillageTract(villageTracts[0].id);
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
        id="selectVillageTract"
        value={villageTract}
        onChange={(e) => {
          setVillageTract(e.target.value);
        }}
      >
        {villageTracts.map((i) => (
          <MenuItem key={i.id} value={i.id} selected={i.id === villageTracts[0].id ? true : false}>
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

VillageEditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired
};

export default VillageEditToolbar;
