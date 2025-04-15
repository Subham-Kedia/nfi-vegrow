import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Field } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';

const FieldDatepicker = ({
  name,
  label,
  helperText,
  validate,
  onChange,
  textFieldProps,
  minDate,
  maxDate,
  ...props
}) => {
  return (
    <Field name={name} label={label} validate={validate}>
      {({ field, form: { touched, errors, submitCount, setFieldValue } }) => {
        const error =
          _get(touched, field.name) || submitCount
            ? _get(errors, field.name)
            : false;
        return (
          <DatePicker
            label={label}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              setFieldValue(name, date?.valueOf());
              if (onChange) {
                onChange(date?.valueOf());
              }
            }}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error || helperText || '',
                ...textFieldProps,
              },
            }}
            {...props}
          />
        );
      }}
    </Field>
  );
};

FieldDatepicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
};

export default FieldDatepicker;
