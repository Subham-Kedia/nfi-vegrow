import { useRef } from 'react';
import Typography from '@mui/material/Typography';
import AppButton from 'Components/AppButton';
import { Field, useFormikContext } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';

const UploadInput = ({
  name,
  type = 'file',
  size = 'small',
  label,
  validate,
  accept,
  handleChange,
  buttonVariant,
  disabled,
  ...props
}) => {
  const { values } = useFormikContext();
  const inputRef = useRef(null);
  return (
    <Field name={name} label={label} validate={validate}>
      {({ field, form: { touched, errors, submitCount, setFieldValue } }) => {
        const error =
          _get(touched, field.name) || submitCount
            ? _get(errors, field.name)
            : false;

        return (
          <label htmlFor={name}>
            <AppButton
              variant={buttonVariant || 'contained'}
              component="span"
              size={size || 'medium'}
              error={error || ''}
              disabled={disabled}
            >
              {label || 'Upload'}
            </AppButton>
            {!!error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <input
              accept={accept}
              id={name}
              className="hidden"
              multiple
              type={type}
              {...props}
              onChange={(event) => {
                const previousUploads = values[field.name] || [];

                const currentUpload = props.multiple
                  ? [...previousUploads, ...event.target.files]
                  : event.target.files;

                setFieldValue(field.name, Array.from(currentUpload));

                if (handleChange) {
                  handleChange(Array.from(currentUpload));
                }

                inputRef.current.value = null;
              }}
              ref={inputRef}
            />
          </label>
        );
      }}
    </Field>
  );
};

UploadInput.propTypes = {
  name: PropTypes.string.isRequired,
};

export default UploadInput;
