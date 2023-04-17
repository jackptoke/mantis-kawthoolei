import PropTypes from 'prop-types';
import { useGridApiContext } from '@mui/x-data-grid-pro';
import { Select } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function SelectRelgionInputCell(props) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  const [religions, setReligions] = useState([]);
  const supabaseClient = useSupabaseClient();

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    apiRef.current.stopCellEditMode({ id, field });
  };

  const getReligions = async () => {
    const { data, error } = await supabaseClient.from('Religions').select(`id, name_kar`);
    if (data && !error)
      setReligions(
        data.map((r) => {
          return { value: r.id, label: r.name_kar };
        })
      );
  };

  useEffect(() => {
    getReligions();
  }, []);

  return (
    <Select value={value} onChange={handleChange} size="large" sx={{ height: 1, width: 1 }} native autoFocus>
      {religions.map((g) => (
        <option value={g.value} key={g.value}>
          {g.label}
        </option>
      ))}
    </Select>
  );
}

SelectRelgionInputCell.propTypes = {
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

export default SelectRelgionInputCell;
