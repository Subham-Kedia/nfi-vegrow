import React from 'react';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
import { Field } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import { convertUTCDateToLocalDate } from 'Utilities/dateUtils';

const FieldDateTImepicker = ({
  name,
  label,
  helperText,
  validate,
  minDate,
  dateDisabled = true,
  disabledDateStyle = { opacity: '0.2' },
  minDateErrorMessage,
  maxDate,
  maxDateErrorMessage,
  textFieldProps,
  ...props
}) => {
  const onDateChange = (name, setValue) => {
    return (date) => {
      const selectedTime = date?.valueOf();
      if (selectedTime && minDate && selectedTime < minDate) {
        typeof minDateErrorMessage === 'function' && minDateErrorMessage();
        return setValue(name, minDate);
      }
      if (selectedTime && maxDate && selectedTime > maxDate) {
        typeof minDateErrorMessage === 'function' && maxDateErrorMessage();
        return setValue(name, maxDate);
      }
      setValue(name, selectedTime);
    };
  };

  const renderDay = (day, _, __, dayComponent) => {
    if (!minDate && !maxDate) return dayComponent;

    const milliseconds = convertUTCDateToLocalDate(day);

    const minDateString = new Date(minDate).toDateString();
    const maxDateString = new Date(maxDate).toDateString();

    if (
      milliseconds < new Date(minDateString).getTime() ||
      milliseconds > new Date(maxDateString).getTime()
    ) {
      return <div style={disabledDateStyle}>{dayComponent}</div>;
    }

    return dayComponent;
  };

  return (
    <Field name={name} label={label} validate={validate}>
      {({ field, form: { touched, errors, submitCount, setFieldValue } }) => {
        const error =
          _get(touched, field.name) || submitCount
            ? _get(errors, field.name)
            : false;
        return (
          <MobileDateTimePicker
            label={label}
            format="DD/MM/YYYY HH:mm A"
            value={field.value ? dayjs(field.value) : null}
            onChange={onDateChange(name, setFieldValue)}
            renderDay={renderDay}
            minDate={(dateDisabled && minDate) || undefined}
            maxDate={(dateDisabled && maxDate) || undefined}
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

FieldDateTImepicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dateDisabled: PropTypes.bool,
  disabledDateStyle: PropTypes.object,
  minDateErrorMessage: PropTypes.func,
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxDateErrorMessage: PropTypes.func,
};

export default FieldDateTImepicker;
