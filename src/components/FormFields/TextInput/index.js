import TextField from '@mui/material/TextField';
import { Field } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';

const FieldInput = ({ name, type, label, helperText, validate, ...props }) => {
  return (
    <Field name={name} label={label} validate={validate}>
      {({ field, form: { touched, errors, submitCount } }) => {
        const error =
          _get(touched, field.name) || submitCount
            ? _get(errors, field.name)
            : false;
        return (
          <TextField
            type={type}
            label={label}
            error={!!error}
            helperText={error || helperText || ''}
            multiline={!!props.minRows}
            {...field}
            value={field.value === undefined ? '' : field.value}
            {...props}
          />
        );
      }}
    </Field>
  );
};

FieldInput.defaultProps = {
  type: 'text',
};

FieldInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
};

export default FieldInput;
