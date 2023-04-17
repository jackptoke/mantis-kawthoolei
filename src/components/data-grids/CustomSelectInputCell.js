import PropTypes from 'prop-types';
import { useGridApiContext } from '@mui/x-data-grid-pro';

import { Select } from '@mui/material';

function CustomSelectInputCell(props) {
  const { id, value, field, options } = props;
  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select value={value} onChange={handleChange} size="large" sx={{ height: 1, width: 1 }} native autoFocus>
      {options.map((g) => (
        <option value={g.value} key={g.value}>
          {g.label}
        </option>
      ))}
    </Select>
  );
}

CustomSelectInputCell.propTypes = {
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
  value: PropTypes.any,

  options: PropTypes.array.isRequired
};

export default CustomSelectInputCell;
