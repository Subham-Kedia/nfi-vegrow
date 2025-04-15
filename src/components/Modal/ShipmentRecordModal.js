import SaveIcon from '@mui/icons-material/Save';
import { Grid, Typography } from '@mui/material';
import { AppButton, ImageThumb } from 'Components';
import { FieldDateTimePicker, UploadInput } from 'Components/FormFields';
import CustomModal from 'Components/Modal';
import { Formik } from 'formik';
import { validateRequired } from 'Utilities/formvalidation';

import {
  AllotmentWrapper,
  ButtonWrapper,
  GridWrapper,
  RecordGridContainer,
} from './style';

const ShipmentRecordModal = ({
  datePickerLabel,
  open,
  close,
  title,
  imageHeaderName,
  images,
  shipmentImage,
  recordTimeFieldName,
  time,
  recordSubHeader = '',
  buttonText = 'SAVE',
  submitForm = () => {},
}) => {
  const inputImageArray = `${shipmentImage}_input`;

  const removeAttachments = (index, field, values, setFieldValue) => {
    const shipmentImageArray = values[field];
    shipmentImageArray.splice(index, 1);
    setFieldValue(field, shipmentImageArray);
  };

  return (
    <CustomModal open={open} onClose={close} title={title}>
      <AllotmentWrapper>
        <Formik
          initialValues={{
            [shipmentImage]: images,
            [recordTimeFieldName]: time || Date.now(),
          }}
          onSubmit={submitForm}
        >
          {({ isSubmitting, handleSubmit, values, setFieldValue }) => (
            <>
              <RecordGridContainer>
                <Grid>
                  <Typography variant="subtitle1">{recordSubHeader}</Typography>
                </Grid>
                <FieldDateTimePicker
                  fullWidth
                  name={recordTimeFieldName}
                  label={datePickerLabel}
                  format="DD/MM/YYYY HH:mm A"
                  placeholder="Arrival Time"
                  autoOk
                  inputVariant="outlined"
                  required
                  validate={validateRequired}
                  InputLabelProps={{
                    required: true,
                    shrink: true,
                  }}
                  textFieldProps={{
                    size: 'small',
                    fullWidth: true,
                  }}
                />
                <GridWrapper>
                  <Typography variant="subtitle1">{imageHeaderName}</Typography>
                  <UploadInput
                    accept="image/*, application/pdf"
                    name={inputImageArray}
                    label="UPLOAD"
                    multiple
                  />
                </GridWrapper>
                <Grid container direction="row" alignItems="center">
                  {values[inputImageArray]?.map((file, index) => (
                    <ImageThumb
                      key={file.url}
                      file={file}
                      url={file.url}
                      removeAttachment={() =>
                        removeAttachments(
                          index,
                          inputImageArray,
                          values,
                          setFieldValue,
                        )
                      }
                    />
                  ))}
                </Grid>
                <Grid container direction="row" alignItems="center">
                  {values[shipmentImage]?.map((file, index) => (
                    <ImageThumb
                      key={file.url}
                      file={file}
                      url={file.url}
                      removeAttachment={() =>
                        removeAttachments(
                          index,
                          shipmentImage,
                          values,
                          setFieldValue,
                        )
                      }
                    />
                  ))}
                </Grid>
              </RecordGridContainer>
              <ButtonWrapper>
                <AppButton
                  startIcon={<SaveIcon />}
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  {buttonText}
                </AppButton>
              </ButtonWrapper>
            </>
          )}
        </Formik>
      </AllotmentWrapper>
    </CustomModal>
  );
};

export default ShipmentRecordModal;
