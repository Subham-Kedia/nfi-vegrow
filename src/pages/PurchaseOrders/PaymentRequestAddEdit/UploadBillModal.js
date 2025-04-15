import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';
import AppButton from 'Components/AppButton';
import FieldInput from 'Components/FormFields/TextInput';
import UploadInput from 'Components/FormFields/UploadInput';
import ImageThumb from 'Components/ImageThumb';
import CustomModal from 'Components/Modal';
import { Formik } from 'formik';
import { validateRequired } from 'Utilities/formvalidation';

import {
  AllotmentWrapper,
  ButtonWrapper,
  ImageListWrapper,
  RecordGridContainer,
} from './styled';

const UploadBillModal = ({ open, close, setFieldValue }) => {
  const submitForm = (values) => {
    const { bill_number, payment_request_bill } = values || {};
    setFieldValue('bill_number', bill_number);
    setFieldValue('payment_request_bill', payment_request_bill);
    close(true);
  };

  return (
    <CustomModal title="Upload Bills" open={open} onClose={close}>
      <AllotmentWrapper>
        <Formik initialValues={{}} onSubmit={submitForm} enableReinitialize>
          {({ handleSubmit, isSubmitting, values }) => (
            <>
              <RecordGridContainer
                container
                direction="column"
                spacing={0}
                style={{ flex: 1, alignContent: 'baseline' }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={0}
                >
                  <FieldInput
                    name="bill_number"
                    type="text"
                    size="small"
                    placeholder="Bill Number"
                    required
                    validate={validateRequired}
                  />
                  <UploadInput
                    accept="image/*, application/pdf"
                    name="payment_request_bill"
                    label="Attach bill"
                    multiple={false}
                  />
                </Grid>
                {values?.payment_request_bill && (
                  <RecordGridContainer
                    container
                    direction="row"
                    alignItems="center"
                    spacing={0}
                  >
                    <ImageListWrapper>
                      {(values?.bill_number ||
                        values?.payment_request_bill) && (
                        <ImageThumb
                          url={values?.bill_number || ''}
                          file={values?.payment_request_bill?.[0] || ''}
                        />
                      )}
                    </ImageListWrapper>
                  </RecordGridContainer>
                )}
              </RecordGridContainer>
              <ButtonWrapper>
                <AppButton
                  startIcon={<SaveIcon />}
                  variant="contained"
                  size="small"
                  color="primary"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                  disabled={!values?.payment_request_bill}
                >
                  Save
                </AppButton>
              </ButtonWrapper>
            </>
          )}
        </Formik>
      </AllotmentWrapper>
    </CustomModal>
  );
};

export default UploadBillModal;
