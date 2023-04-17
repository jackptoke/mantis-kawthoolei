import PropTypes from 'prop-types';
import { useGridApiContext } from '@mui/x-data-grid-pro';
import { TextField } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  textField: {
    width: '25ch',
    background: 'white'
  }
}));
function CustomInputComponent(props) {
  const classes = useStyles();
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleValueChange = (event) => {
    const newValue = event.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };
  return (
    <TextField type="text" value={value} onChange={handleValueChange} size="large" variant="filled" className={clsx(classes.textField)} />
  );
}

CustomInputComponent.propTypes = {
  field: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  value: PropTypes.string
};

export default CustomInputComponent;
