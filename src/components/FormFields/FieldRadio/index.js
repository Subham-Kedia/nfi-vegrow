import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Field } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';

const FieldRadio = ({
  options,
  name,
  label,
  helperText,
  validate,
  disabled,
  row = true,
  ...props
}) => {
  return (
    <Field name={name} label={label} validate={validate}>
      {({ field, form: { touched, errors, submitCount } }) => {
        const error =
          _get(touched, field.name) || submitCount
            ? _get(errors, field.name)
            : false;
        return (
          <FormControl component="fieldset" error={!!error}>
            {label && <FormLabel component="legend">{label}</FormLabel>}
            <RadioGroup
              aria-label={name}
              name={name}
              {...field}
              {...props}
              row={row}
            >
              {options?.map((o) => (
                <FormControlLabel
                  key={o.value}
                  value={o.value}
                  label={o.label}
                  disabled={disabled}
                  control={<Radio color="primary" />}
                />
              ))}
            </RadioGroup>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    </Field>
  );
};
FieldRadio.defaultProps = {
  disabled: false,
};

FieldRadio.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default FieldRadio;
