import { useState } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function DistrictEditToolbar(props) {
  const supabase = useSupabaseClient();

  const { rows, setRows, setSnackbar } = props;
  const [nameKar, setNameKar] = useState('');
  const [nameBur, setNameBur] = useState('');
  const [nameEng, setNameEng] = useState('');

  const handleClick = async () => {
    console.log('Clicked');
    if (nameKar.trim().length === 0 || nameBur.trim().length === 0 || nameEng.trim().length === 0) {
      setSnackbar({ children: 'One or more field is empty', severity: 'error' });
      return;
    }

    const newDistrict = { name_kar: nameKar, name_bur: nameBur, name_eng: nameEng };

    const { data, error } = await supabase.from('Districts').insert(newDistrict).select();

    if (error) {
      setSnackbar({ children: 'District add unsuccessfully', severity: 'error' });
      return;
    }

    if (data) {
      setRows([...rows, data[0]]);
      setSnackbar({ children: 'District successfully saved', severity: 'success' });
      setNameBur('');
      setNameKar('');
      setNameEng('');
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
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

DistrictEditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired
};

export default DistrictEditToolbar;
