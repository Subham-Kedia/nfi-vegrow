import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Field } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';

const FieldTimepicker = ({ name, label, helperText, validate, ...props }) => {
  return (
    <Field name={name} label={label} validate={validate}>
      {({ field, form: { touched, errors, submitCount, setFieldValue } }) => {
        const error =
          _get(touched, field.name) || submitCount
            ? _get(errors, field.name)
            : false;
        return (
          <TimePicker
            label={label}
            value={field.value || null}
            onChange={(date) => setFieldValue(name, date?.getTime())}
            error={!!error}
            helperText={error || helperText || ''}
            {...props}
          />
        );
      }}
    </Field>
  );
};

FieldTimepicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default FieldTimepicker;
