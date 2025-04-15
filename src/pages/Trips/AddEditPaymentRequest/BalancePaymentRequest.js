import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DialogContentText,
  Grid,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import {
  AppButton,
  AppLoader,
  ConfirmationDialog,
  DeleteButton,
  ImageThumb,
} from 'Components';
import { FieldCombo, FieldDatePicker, FieldInput } from 'Components/FormFields';
import { Formik } from 'formik';
import useTripsAccess from 'Hooks/useRoleBasedAccess';
import RouteTransformer from 'Routes/routeTransformer';
import {
  createPaymentRequest,
  deletePaymentRequestById,
  getPaymentRequestById,
  getTripApprovers,
  updatePaymentRequest,
} from 'Services/payments';
import { notifyUser, saveAttachments } from 'Utilities';
import {
  PAYMENT_REQUEST_TYPE,
  STATUS,
} from 'Utilities/constants/paymentRequest';
import { ACCESS_RESTRICTION_MSSG } from 'Utilities/constants/trips';
import { validateMaxOrEquals } from 'Utilities/formvalidation';

import UploadBillModal from '../../PurchaseOrders/PaymentRequestAddEdit/UploadBillModal';
import { classes } from '../style';

const BalancePaymentRequest = () => {
  const { userInfo: { id: userId } = {} } = useSiteValue();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openDeletePR, setOpenDeletePR] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState({});
  const [parentPR, setParentPR] = useState({});
  const [approverList, setApproverList] = useState([]);
  const [showUploadBillModal, setShowUploadBillModal] = useState(false);

  const { tripId, parentId, prId = null } = useParams();

  const shouldDisableFormFields = useTripsAccess();

  const { marginTopSpace, marginCombination, fullWidth, paddingCombination } =
    classes();

  useEffect(() => {
    if (shouldDisableFormFields && !prId) {
      notifyUser(ACCESS_RESTRICTION_MSSG, 'error');
      setTimeout(returnToListingPage, 1500);
    }
  }, [prId, shouldDisableFormFields]);

  useEffect(() => {
    if (parentId) {
      setLoading(true);

      getPaymentRequestById(parentId)
        .then((res) => {
          setParentPR(res);
        })
        .finally(() => setLoading(false));
    }
    if (prId) {
      setLoading(true);

      getPaymentRequestById(prId)
        .then((res) => {
          setPaymentRequest(res);
        })
        .finally(() => setLoading(false));
    }

    getTripApprovers().then((res) => {
      if (res.items) {
        setApproverList(res.items);
      }
    });
  }, [tripId, parentId, prId]);

  const deletePaymentRequest = () => {
    return deletePaymentRequestById(prId, { nfi_trip: true }).then(() => {
      notifyUser('Payment Request deleted successfully.');
      returnToListingPage();
    });
  };

  const returnToListingPage = () => {
    navigate(`/app/${RouteTransformer.getPrListingLink(tripId)}`);
  };

  const toggleShowUploadBillModal = () => {
    setShowUploadBillModal(!showUploadBillModal);
  };

  const remainingAmount = () => {
    const { bill_parent_cost = 0, bill_value_raised = 0 } = parentPR || {};
    return bill_parent_cost - bill_value_raised;
  };

  const submitPaymentRequest = (values, { setSubmitting }) => {
    setSubmitting(true);
    const {
      id: parent_bill_id,
      priority,
      vendor: { id: vendor_id },
      cost_head_id,
      nfi_trip_id,
    } = parentPR;
    const {
      amount,
      approvers = [],
      due_date,
      comments,
      payment_request_bill,
      bill_number,
    } = values;

    const defaultData = {
      ...(prId
        ? {}
        : {
            created_date: Date.now(),
            creator_id: userId,
            nfi_trip_id,
          }),
      payment_request_type: PAYMENT_REQUEST_TYPE.ADVANCE,
      status: STATUS.PENDING,
    };

    const payment_request = {
      ...defaultData,
      vendor_id,
      parent_bill_id,
      priority,
      cost_head_id,
      approver_ids: approvers.map((ap) => ap.id),
      amount,
      due_date,
      comments,
    };

    const processPaymentRequest = prId
      ? updatePaymentRequest
      : createPaymentRequest;

    processPaymentRequest({ payment_request }, prId)
      .then((res) => {
        saveAttachments(
          payment_request_bill,
          bill_number,
          res.id,
          updatePaymentRequest,
        );
        notifyUser(
          `Payment Request ${prId ? 'updated' : 'created'} successfully.`,
        );
        returnToListingPage();
      })
      .finally(() => setSubmitting(false));
  };

  const disableSubmit = (values = {}) => {
    const { approvers, due_date } = values;
    return !(approvers?.length && due_date);
  };

  return loading ? (
    <AppLoader />
  ) : (
    <PageLayout
      title={`Payment Request for Trip: ${tripId}`}
      titleComponent={
        prId ? (
          <DeleteButton
            isDelete={paymentRequest.is_deletable}
            onClick={() => setOpenDeletePR(true)}
            text="DELETE PAYMENT REQUEST"
            disabled={shouldDisableFormFields}
          />
        ) : (
          <></>
        )
      }
    >
      <Formik
        initialValues={paymentRequest}
        enableReinitialize
        onSubmit={submitPaymentRequest}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
          <PageLayout.Body>
            <Paper className={paddingCombination}>
              <Typography variant="h5" gutterBottom>
                PR #{parentId}
              </Typography>
              <Grid container className={marginTopSpace}>
                <Grid item md={2} xs={12}>
                  <Typography variant="body1">Amount Paid</Typography>
                </Grid>
                <Grid item md={2} xs={12}>
                  {parentPR.bill_value_raised}
                </Grid>
              </Grid>
              <Grid container className={marginTopSpace}>
                <Grid item md={2} xs={12}>
                  <Typography variant="body1">Amount to be Paid</Typography>
                </Grid>
                <Grid item md={2} xs={12}>
                  <FieldInput
                    name="amount"
                    size="small"
                    type="number"
                    variant="outlined"
                    placeholder="Partial Amount"
                    className={fullWidth}
                    validate={validateMaxOrEquals(remainingAmount())}
                    disabled={shouldDisableFormFields}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          /{remainingAmount()}
                        </InputAdornment>
                      ),
                    }}
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
                    disabled={shouldDisableFormFields}
                    textFieldProps={{ size: 'small' }}
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
                    disabled={shouldDisableFormFields}
                  />
                </Grid>
              </Grid>
              <Grid container className={marginTopSpace}>
                <Grid item md={2} xs={12}>
                  <Typography variant="body1">Comments</Typography>
                </Grid>
                <Grid item md={2} xs={12}>
                  <FieldInput
                    name="comments"
                    size="medium"
                    variant="outlined"
                    multiline
                    className={fullWidth}
                    rows={2}
                    disabled={shouldDisableFormFields}
                  />
                </Grid>
              </Grid>
              <Grid container className={marginTopSpace}>
                <Grid item md={2} xs={12}>
                  <AppButton
                    variant="contained"
                    color="primary"
                    className={marginCombination}
                    onClick={toggleShowUploadBillModal}
                    disabled={shouldDisableFormFields}
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
                      title={
                        values.bill_number && `Bill.No.-${values.bill_number}`
                      }
                    />
                  )}
                </Grid>
                <Grid item md={2} xs={12}>
                  <AppButton
                    variant="contained"
                    color="inherit"
                    onClick={returnToListingPage}
                    className={marginCombination}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    variant="contained"
                    color="primary"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      disableSubmit(values) ||
                      shouldDisableFormFields
                    }
                  >
                    Save
                  </AppButton>
                </Grid>
              </Grid>
            </Paper>
          </PageLayout.Body>
        )}
      </Formik>

      <ConfirmationDialog
        title="Warning!"
        open={openDeletePR}
        onConfirm={() => deletePaymentRequest()}
        onCancel={() => setOpenDeletePR(false)}
      >
        <DialogContentText>
          Are you sure you want to delete this Payment request ?
        </DialogContentText>
      </ConfirmationDialog>
    </PageLayout>
  );
};

export default BalancePaymentRequest;
