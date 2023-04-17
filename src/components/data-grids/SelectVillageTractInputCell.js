import PropTypes from 'prop-types';
import { useGridApiContext } from '@mui/x-data-grid-pro';
import { Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function SelectVillageTractInputCell(props) {
  const supabaseClient = useSupabaseClient();
  const { id, value, field } = props;
  const [villageTracts, setVillageTracts] = useState([]);
  const apiRef = useGridApiContext();

  useEffect(() => {
    const getVillageTracts = async () => {
      const { data, error } = await supabaseClient.from('VillageTracts').select('id, name_kar');
      if (data && !error) {
        setVillageTracts(data);
      }
    };

    getVillageTracts();
  });

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select value={value} onChange={handleChange} size="large" sx={{ height: 1, width: 1 }} native autoFocus>
      {villageTracts.map((v) => (
        <option value={v.id} key={v.id}>
          {v.name_kar}
        </option>
      ))}
    </Select>
  );
}

SelectVillageTractInputCell.propTypes = {
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

export default SelectVillageTractInputCell;
