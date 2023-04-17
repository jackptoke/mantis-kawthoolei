const { FormControl, Select, InputLabel } = require('@mui/material');
import PropTypes from 'prop-types';

function CustomSelectInput(props) {
  const { label, name, value, setValue, options } = props;

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  var id = `id-${Date.now()}`;

  return (
    <FormControl>
      <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
      <Select
        native
        name={name}
        value={value}
        onChange={handleChange}
        inputProps={{ name: label, id: `${id}-select-label` }}
        disabled={options.length === 0}
        sx={{ width: 150 }}
      >
        <option value="" key="blank-item">
          {`              `}
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
  options: PropTypes.array.isRequired,
  name: PropTypes.string
};

export default CustomSelectInput;
