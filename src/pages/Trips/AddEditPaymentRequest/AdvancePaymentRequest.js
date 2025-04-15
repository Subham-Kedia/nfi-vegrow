import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, ImageThumb } from 'Components';
import { FieldCombo, FieldDatePicker, FieldInput } from 'Components/FormFields';
import { Formik } from 'formik';
import RouteTransformer from 'Routes/routeTransformer';
import { createPaymentRequest, updatePaymentRequest } from 'Services/payments';
import { notifyUser } from 'Utilities';
import {
  PAYMENT_REQUEST_PRIORITY,
  PAYMENT_REQUEST_TYPE,
  STATUS,
} from 'Utilities/constants/paymentRequest';
import imageDirectUpload from 'Utilities/directUpload';

import UploadBillModal from '../../PurchaseOrders/PaymentRequestAddEdit/UploadBillModal';
import { classes } from '../style';

const AdvancePaymentRequest = (props) => {
  const [showUploadBillModal, setShowUploadBillModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { tripId, prId = null } = params;
  const { userInfo: { id: userId } = {} } = useSiteValue();
  const navigate = useNavigate();

  const { marginTopSpace, fullWidth, marginCombination } = classes();

  const {
    approverList,
    vendorId: vendor_id,
    transportCostHeadId,
    disableFormFields,
  } = props;

  const submitAdvancePayment = async (values) => {
    setLoading(true);
    const {
      approvers = [],
      priority,
      payment_request_bill: { 0: file } = [],
      bill_number,
      ...rest
    } = values;
    const { data: tripAdvancePRData = {} } =
      (await imageDirectUpload(file)) || {};

    const defaultData = {
      created_date: Date.now(),
      payment_request_type: PAYMENT_REQUEST_TYPE.ADVANCE,
      creator_id: userId,
      priority: priority
        ? PAYMENT_REQUEST_PRIORITY.HIGH
        : PAYMENT_REQUEST_PRIORITY.LOW,
      ...(vendor_id ? { vendor_id } : {}),
      nfi_trip_id: +tripId,
    };

    const payment_request = {
      ...defaultData,
      ...rest,
      bill: tripAdvancePRData.signed_id,
      bill_number,
      status: STATUS.PENDING,
      approver_ids: approvers.map((ap) => ap.id),
      cost_head_id: transportCostHeadId,
    };

    const processPaymentRequest = prId
      ? updatePaymentRequest
      : createPaymentRequest;

    processPaymentRequest({ payment_request }, prId)
      .then(() => {
        notifyUser(
          `Payment Request ${prId ? 'updated' : 'created'} successfully.`,
        );
        returnToListingPage();
      })
      .finally(() => setLoading(false));
  };

  const returnToListingPage = () => {
    navigate(`/app/${RouteTransformer.getPrListingLink(tripId)}`);
  };

  const toggleShowUploadBillModal = () => {
    setShowUploadBillModal(!showUploadBillModal);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={props}
      onSubmit={submitAdvancePayment}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <Grid container>
          <Grid container className={marginTopSpace}>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">Amount</Typography>
            </Grid>
            <Grid item md={2} xs={12}>
              <FieldInput
                name="amount"
                size="small"
                type="number"
                variant="outlined"
                placeholder="Advance amount"
                className={fullWidth}
                disabled={disableFormFields}
              />
            </Grid>
          </Grid>
          <Grid container className={marginTopSpace}>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">Approver</Typography>
            </Grid>
            <Grid item md={2} xs={12}>
              <FieldCombo
                name="approvers"
                placeholder="Select approver"
                variant="outlined"
                options={approverList}
                multiple
                disabled={disableFormFields}
              />
            </Grid>
          </Grid>
          <Grid container className={marginTopSpace}>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">Due Date</Typography>
            </Grid>
            <Grid item md={2} xs={12}>
              <FieldDatePicker
                name="due_date"
                placeholder="Due Date"
                variant="inline"
                autoOk
                inputVariant="outlined"
                disabled={disableFormFields}
                textFieldProps={{ size: 'small' }}
              />
            </Grid>
          </Grid>
          <Grid container className={marginTopSpace}>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">Comment</Typography>
            </Grid>
            <Grid item md={2} xs={12}>
              <FieldInput
                name="comments"
                size="medium"
                variant="outlined"
                placeholder="Comments"
                multiline
                className={fullWidth}
                rows={2}
                disabled={disableFormFields}
              />
            </Grid>
          </Grid>
          <Grid container className={marginTopSpace}>
            <Grid item md={2} xs={12}>
              <AppButton
                size="medium"
                className="margin-horizontal"
                onClick={toggleShowUploadBillModal}
                disabled={disableFormFields}
              >
                Attach bill
              </AppButton>
              <UploadBillModal
                open={!!showUploadBillModal}
                close={toggleShowUploadBillModal}
                setFieldValue={setFieldValue}
              />
            </Grid>
          </Grid>
          <Grid
            container
            className={marginTopSpace}
            justifyContent="space-between"
          >
            <Grid item md={2} xs={12}>
              {(values.bill || values.payment_request_bill) && (
                <ImageThumb
                  url={values.bill || ''}
                  file={values.payment_request_bill?.[0] || ''}
                  title={values.bill_number && `Bill.No.-${values.bill_number}`}
                />
              )}
            </Grid>
            <Grid item md={2} xs={12}>
              <AppButton
                size="medium"
                color="inherit"
                onClick={returnToListingPage}
              >
                Cancel
              </AppButton>
              <AppButton
                size="medium"
                className={marginCombination}
                disabled={
                  !values.approvers?.length ||
                  !values.due_date ||
                  disableFormFields
                }
                loading={loading}
                onClick={handleSubmit}
              >
                Save
              </AppButton>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};

export default AdvancePaymentRequest;
