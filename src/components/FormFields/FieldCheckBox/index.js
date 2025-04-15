import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { Field } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';

const FieldCheckbox = ({
  options,
  name,
  label,
  validate,
  size,
  disabled,
  labelPlacement,
  ...props
}) => {
  return (
    <FormControl component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup {...props}>
        {options?.map((o) => {
          return (
            <Field
              key={`${name}.${o.key}`}
              name={`${name}.${o.key}`}
              label={o.label}
              validate={validate}
            >
              {({
                field,
                form: { touched, errors, submitCount, setFieldValue },
              }) => {
                const error =
                  _get(touched, field.name) || submitCount
                    ? _get(errors, field.name)
                    : false;
                return (
                  <FormControlLabel
                    checked={field.value || false}
                    label={o.label}
                    labelPlacement={labelPlacement}
                    disabled={disabled}
                    error={error}
                    onChange={(event) =>
                      setFieldValue(`${name}.${o.key}`, event.target.checked)
                    }
                    control={
                      <Checkbox
                        color="primary"
                        size={size}
                        name={`${name}.${o.key}`}
                      />
                    }
                  />
                );
              }}
            </Field>
          );
        })}
      </FormGroup>
      {/* {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )} */}
    </FormControl>
  );
};
FieldCheckbox.defaultProps = {
  disabled: false,
  size: 'small',
  label: '',
};

FieldCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default FieldCheckbox;
