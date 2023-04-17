import { useState } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { Button, FormControl, InputLabel, Select, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { DesktopDatePicker } from '@mui/x-date-pickers-pro';
import { statuses } from 'data/kecd';
import { ethnicities, genders } from 'data/interior';
import { useEffect } from 'react';
import dayjs from 'dayjs';

function CustomSelectInput(props) {
  const { label, value, setValue, options } = props;

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  var id = `id-${Date.now()}`;
  console.log({ Options: options });

  return (
    <FormControl>
      <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
      <Select native value={value} onChange={handleChange} inputProps={{ name: label, id: `${id}-select-label` }}>
        <option value="" key="blank-item">
          <em>{``}</em>
        </option>
        {options.map((g) => (
          <option value={g.value} key={g.value}>
            {g.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

CustomSelectInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  setValue: PropTypes.func.isRequired,

  options: PropTypes.array.isRequired
};

function StudentEditToolbar(props) {
  const supabase = useSupabaseClient();
  const { rows, setRows, setSnackbar } = props;
  const [nameKar, setNameKar] = useState('');
  const [nameBur, setNameBur] = useState('');
  const [nameEng, setNameEng] = useState('');
  const [dob, setDob] = useState(dayjs('2014-08-18T21:11:54'));
  const [status, setStatus] = useState('');
  const [ethnic, setEthnic] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');

  const [religions, setReligions] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const getReligions = async () => {
      const { data, error } = await supabase.from('Religions').select('id, name_kar');
      if (error) return;
      setReligions(
        data.map((r) => {
          return { value: r.id, label: r.name_kar };
        })
      );
    };
    if (!rendered) {
      getReligions();
      setRendered(true);
    }
  }, [rendered]);

  useEffect(() => {
    if (religions.length > 0) setReligion(religions[0].value);
  }, [religions]);

  const handleClick = async () => {
    if (nameKar.trim().length === 0 || nameBur.trim().length === 0 || nameEng.trim().length === 0) {
      setSnackbar({ children: 'One or more field is empty', severity: 'error' });
      return;
    }

    const newStudent = {
      name_kar: nameKar,
      name_bur: nameBur,
      name_eng: nameEng,
      father_name_kar: fatherName,
      mother_name_kar: motherName,
      gender: gender,
      ethnic: ethnic,
      religion_id: parseInt(religion),
      status: status,
      dob: dob.toISOString().split('T')[0]
    };

    console.log({ newStudent });

    const { data, error } = await supabase.from('Students').insert(newStudent).select();

    if (error) {
      setSnackbar({ children: 'Student add unsuccessfully', severity: 'error' });
      return;
    }

    if (data) {
      setRows([...rows, data[0]]);

      setNameBur('');
      setNameKar('');
      setNameEng('');
      setFatherName('');
      setMotherName('');
      setGender(genders[0].value);
      setReligion(religions[0].value);
      setEthnic(ethnicities[0].value);
      setStatus(statuses[0].value);

      setSnackbar({ children: 'Student successfully saved', severity: 'success' });
    }
  };

  return (
    <GridToolbarContainer>
      <TextField
        id="txtNameKar"
        label="Name (Kar)"
        value={nameKar}
        onChange={(e) => {
          setNameKar(e.target.value);
        }}
        required
      />
      <TextField
        id="txtNameBur"
        label="Name (Bur)"
        value={nameBur}
        onChange={(e) => {
          setNameBur(e.target.value);
        }}
        required
      />
      <TextField
        id="txtNameEng"
        label="Name (Eng)"
        value={nameEng}
        onChange={(e) => {
          setNameEng(e.target.value);
        }}
        required
      />
      <TextField
        id="txtFatherName"
        label="Name of father"
        value={fatherName}
        onChange={(e) => {
          setFatherName(e.target.value);
        }}
      />
      <TextField
        id="txtNameEng"
        label="Name of mother"
        value={motherName}
        onChange={(e) => {
          setMotherName(e.target.value);
        }}
      />
      <DesktopDatePicker
        label="DOB"
        inputFormat="DD/MM/YYYY"
        value={dob}
        onChange={(e) => {
          setDob(e);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
      <CustomSelectInput key={'status-select'} label="Status" value={status} setValue={setStatus} options={statuses} />
      <CustomSelectInput key={'ethnic-select'} label="Ethnic" value={ethnic} setValue={setEthnic} options={ethnicities} />
      <CustomSelectInput key={'gender-select'} label="Gender" value={gender} setValue={setGender} options={genders} />
      <CustomSelectInput key={'religion-select'} label="Religion" value={religion} setValue={setReligion} options={religions} />
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

StudentEditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired
};

export default StudentEditToolbar;
