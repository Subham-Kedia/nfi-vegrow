import { useState } from 'react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SaveIcon from '@mui/icons-material/Save';
import DialogContentText from '@mui/material/DialogContentText';
import Grid from '@mui/material/Grid';
import AppButton from 'Components/AppButton';
import ConfirmationDialog from 'Components/ConfirmationDialog';
import FieldInput from 'Components/FormFields/TextInput';
import UploadInput from 'Components/FormFields/UploadInput';
import ImageThumb from 'Components/ImageThumb';
import CustomModal from 'Components/Modal';
import { Formik } from 'formik';
import { notifyUser } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';
import { validateRequired } from 'Utilities/formvalidation';
import { validateNumbers } from 'Utilities/mathExpert';

import {
  deleteEwayBill,
  uploadEwayBills,
} from '../../../services/transferOrder';
import {
  AllotmentWrapper,
  ButtonWrapper,
  ImageListWrapper,
  RecordGridContainer,
} from '../../PurchaseOrders/PaymentRequestAddEdit/styled';

const UploadEwayBillModal = ({
  open,
  close,
  title,
  toId,
  eway_bill_items,
  onApiCallReloadTo,
}) => {
  const [ewayBillItemIndex, setEwayBillItemIndex] = useState(null);
  const [confirmDeleteEwayBill, setConfirmDeleteEwayBill] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleDeleteEwayBillItem = () => {
    setConfirmDeleteEwayBill(!confirmDeleteEwayBill);
  };

  const removeAttachments = () => {
    return deleteEwayBill(eway_bill_items[ewayBillItemIndex].id).then(() => {
      notifyUser('E-way Bill Removed successfully.');

      setConfirmDeleteEwayBill(false);
      close(true);
      onApiCallReloadTo();
    });
  };

  const handleBillNumberChange = (e, setFieldValue) => {
    const val = e.target.value;
    if (validateNumbers(+val)) {
      setFieldValue('bill_number', val);
    }
  };

  const submitForm = async (values) => {
    const { bill_number, eway_bill } = values || {};
    const { data: billData = {} } =
      (await imageDirectUpload(eway_bill?.[0])) || {};
    return uploadEwayBills(
      {
        eway_bill: {
          bill: billData?.signed_id,
          bill_number,
        },
      },
      toId,
    ).then(() => {
      notifyUser('E-way Bill Uploaded successfully.');
      close(true);
      onApiCallReloadTo();
    });
  };

  return (
    <CustomModal title={title} open={open} onClose={close}>
      <AllotmentWrapper>
        <Formik
          initialValues={{ eway_bill_items, bill_number: '' }}
          onSubmit={submitForm}
          enableReinitialize
        >
          {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
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
                    onChange={(e) => handleBillNumberChange(e, setFieldValue)}
                    validate={validateRequired}
                  />
                  <UploadInput
                    key={fileInputKey} // will reinitialize the component if key changes
                    accept="image/*, application/pdf"
                    name="eway_bill"
                    label="UPLOAD E-WAY BILL"
                  />
                </Grid>
                {(values?.eway_bill_items?.length > 0 || values?.eway_bill) && (
                  <RecordGridContainer
                    container
                    direction="row"
                    alignItems="center"
                    spacing={0}
                  >
                    <ImageListWrapper>
                      {values?.eway_bill_items?.map((f, index) => {
                        return (
                          <span key={index}>
                            <ImageThumb file={f.bill} url={f.bill} />
                            <CancelOutlinedIcon
                              className="cancel-icon"
                              color="error"
                              cursor="pointer"
                              onClick={() => {
                                setEwayBillItemIndex(index);
                                handleDeleteEwayBillItem();
                              }}
                            />
                          </span>
                        );
                      })}
                      {values?.eway_bill?.length > 0 && (
                        <span>
                          <ImageThumb
                            url={values?.eway_bill?.[0] || ''}
                            file={values?.eway_bill?.[0] || ''}
                          />
                          <CancelOutlinedIcon
                            className="cancel-icon"
                            color="error"
                            cursor="pointer"
                            onClick={() => {
                              setFieldValue('eway_bill', null);
                              setFileInputKey(fileInputKey + 1);
                            }}
                          />
                        </span>
                      )}
                    </ImageListWrapper>
                  </RecordGridContainer>
                )}
              </RecordGridContainer>
              <ConfirmationDialog
                title="Delete E-way Bill"
                open={confirmDeleteEwayBill}
                onConfirm={removeAttachments}
                onCancel={() => setConfirmDeleteEwayBill(false)}
              >
                <DialogContentText>
                  Are you sure you want to remove this E-way Bill?
                </DialogContentText>
              </ConfirmationDialog>
              <ButtonWrapper>
                <AppButton
                  startIcon={<SaveIcon />}
                  variant="contained"
                  size="small"
                  color="primary"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                  disabled={!values?.eway_bill?.length}
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

export default UploadEwayBillModal;
