import { useState } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { grade_levels } from 'data/kecd';
import AddIcon from '@mui/icons-material/Add';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function SubjectEditToolbar(props) {
  const supabase = useSupabaseClient();

  const { rows, setRows, setSnackbar } = props;
  const [nameKar, setNameKar] = useState('');
  const [nameBur, setNameBur] = useState('');
  const [nameEng, setNameEng] = useState('');
  const [grade, setGrade] = useState('grade-1');

  const handleClick = async () => {
    console.log('Clicked');
    if (nameKar.trim().length === 0 || nameBur.trim().length === 0 || nameEng.trim().length === 0) {
      setSnackbar({ children: 'One or more field is empty', severity: 'error' });
      return;
    }

    const newSubject = { name_kar: nameKar, name_bur: nameBur, name_eng: nameEng, grade_level: grade };

    const { data, error } = await supabase.from('Subjects').insert(newSubject).select();

    if (error) {
      setSnackbar({ children: 'Subject add unsuccessfully', severity: 'error' });
      return;
    }

    if (data) {
      setRows([...rows, data[0]]);
      setSnackbar({ children: 'Subject successfully saved', severity: 'success' });
      setNameBur('');
      setNameKar('');
      setNameEng('');
      setGrade('kindergarten-a');
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
        value={grade}
        onChange={(e) => {
          setGrade(e.target.value);
        }}
      >
        {grade_levels.map((g) => (
          <MenuItem key={g.value} value={g.value}>
            {g.label}
          </MenuItem>
        ))}
      </Select>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

SubjectEditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired
};

export default SubjectEditToolbar;
