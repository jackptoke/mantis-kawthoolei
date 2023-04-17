import PropTypes from 'prop-types';
import { useGridApiContext } from '@mui/x-data-grid-pro';
import { Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function SelectDistrictInputCell(props) {
  const supabaseClient = useSupabaseClient();
  const { id, value, field } = props;
  const [districts, setDistricts] = useState([]);
  const apiRef = useGridApiContext();

  useEffect(() => {
    const getDistricts = async () => {
      const { data, error } = await supabaseClient.from('Districts').select('id, name_kar');
      if (data && !error) {
        setDistricts(data);
      }
    };

    getDistricts();
  });

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select value={value} onChange={handleChange} size="large" sx={{ height: 1, width: 1 }} native autoFocus>
      {districts.map((d) => (
        <option value={d.id} key={d.id}>
          {d.name_kar}
        </option>
      ))}
    </Select>
  );
}

SelectDistrictInputCell.propTypes = {
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any
};

export default SelectDistrictInputCell;
