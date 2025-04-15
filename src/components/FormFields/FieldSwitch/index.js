import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { makeStyles } from '@mui/styles';
import { Field } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  labelText: {
    alignSelf: 'end',
    marginLeft: 0,
  },
  switch: {
    display: 'inline',
  },
});

const FieldSwitch = ({
  name,
  label,
  helperText,
  InputLabelProps,
  labelPlacement = 'start',
  validate,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Field name={name} label={label} validate={validate}>
      {({ field, form: { touched, errors, submitCount } }) => {
        const error =
          _get(touched, field.name) || submitCount
            ? _get(errors, field.name)
            : false;
        return (
          <FormControl
            className={classes.switch}
            fullWidth
            error={error}
            {...InputLabelProps}
          >
            <FormControlLabel
              labelPlacement={labelPlacement}
              className={classes.labelText}
              control={
                <Switch
                  name={name}
                  color="primary"
                  checked={field.value}
                  {...field}
                  {...props}
                />
              }
              label={label}
            />
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    </Field>
  );
};

FieldSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default FieldSwitch;
