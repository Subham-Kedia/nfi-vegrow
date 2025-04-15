import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DialogContentText,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import PageLayout from 'App/PageLayout';
import { AppLoader, ConfirmationDialog, DeleteButton } from 'Components';
import {
  FieldCombo,
  FieldDatePicker,
  FieldSwitch,
} from 'Components/FormFields';
import { Formik } from 'formik';
import useTripsAccess from 'Hooks/useRoleBasedAccess';
import RouteTransformer from 'Routes/routeTransformer';
import {
  deletePaymentRequestById,
  getCostHeads,
  getPaymentRequestById,
  getPaymentRequestVendors,
  getTripApprovers,
  getTripPRDetails,
} from 'Services/payments';
import { notifyUser } from 'Utilities';
import { COST_HEAD } from 'Utilities/constants/costHead';
import {
  PAYMENT_REQUEST_PRIORITY,
  PAYMENT_REQUEST_TYPE,
} from 'Utilities/constants/paymentRequest';
import { ACCESS_RESTRICTION_MSSG } from 'Utilities/constants/trips';

import { classes } from '../style';

import AdvancePaymentRequest from './AdvancePaymentRequest';
import BillPaymentRequest from './BillPaymentRequest';

const AddEditPaymentRequest = () => {
  const [loading, setLoading] = useState(false);
  const [approverList, setApproverList] = useState([]);
  const [openDeletePR, setOpenDeletePR] = useState(false);
  const [tripDetails, setTripDetails] = useState({});
  const [vendorId, setVendorId] = useState();
  const [paymentRequest, setPaymentRequest] = useState({
    payment_request_type: `${PAYMENT_REQUEST_TYPE.ADVANCE}`,
    priority: false,
    advance_amount_adjustments: [],
  });
  const [transportCostHeadId, setCostHeadList] = useState([]);
  const [prVendors, setPrVendors] = useState({});
  const navigate = useNavigate();

  const { tripId, prId = null } = useParams();

  const { paddingCombination, marginTopSpace } = classes();

  const shouldDisableFormFields = useTripsAccess();

  const radioGroupClass = shouldDisableFormFields ? 'disabled' : '';

  useEffect(() => {
    if (!prId && shouldDisableFormFields) {
      notifyUser(ACCESS_RESTRICTION_MSSG, 'error');
      setTimeout(returnToListingPage, 1500);
    }
  }, [prId, shouldDisableFormFields]);

  useEffect(() => {
    if (prId) {
      setLoading(true);

      getPaymentRequestById(prId)
        .then((res) => {
          setPaymentRequest({
            ...res,
            vendorId: res.vendor.id,
            priority: res.priority === PAYMENT_REQUEST_PRIORITY.HIGH,
            payment_request_type: `${res.payment_request_type}`,
          });
        })
        .finally(() => setLoading(false));
    }

    getCostHeads().then((res) => {
      if (res.items) {
        setCostHeadList(
          res.items.find((ch) => ch.name === COST_HEAD.TRANSPORTATION.name).id,
        );
      }
    });

    getPaymentRequestVendors({ nfi_trip_id: tripId }).then((res) =>
      setPrVendors(res),
    );

    getTripApprovers().then((res) => {
      if (res.items) {
        setApproverList(res.items);
      }
    });

    getTripPRDetails(tripId).then((res) => {
      setTripDetails(res);
    });
  }, [prId, tripId]);

  const deletePaymentRequest = () => {
    return deletePaymentRequestById(prId, { nfi_trip: true }).then(() => {
      notifyUser('Payment Request deleted successfully.');
      returnToListingPage();
    });
  };

  const returnToListingPage = () => {
    navigate(`/app/${RouteTransformer.getPrListingLink(tripId)}`);
  };

  return loading ? (
    <AppLoader />
  ) : (
    <PageLayout
      title={`Payment Request Trip: ${tripId}`}
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
      <Formik initialValues={paymentRequest} onSubmit={() => {}}>
        {({ handleChange, values }) => (
          <PageLayout.Body>
            <Paper className={paddingCombination}>
              <Typography variant="body1" gutterBottom>
                {prVendors.address}
              </Typography>
              <Grid
                container
                alignItems="center"
                spacing={1}
                className={marginTopSpace}
              >
                <Grid item md={2} xs={12}>
                  <Typography variant="body1">Priority</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">Low</Typography>
                </Grid>
                <FieldSwitch
                  size="medium"
                  name="priority"
                  checked={values.priority}
                  labelPlacement="end"
                  disabled={shouldDisableFormFields}
                  InputLabelProps={{
                    fullWidth: false,
                  }}
                />
                <Grid item>
                  <Typography variant="body1">High</Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                className={marginTopSpace}
              >
                <Grid item md={2} xs={12}>
                  <Typography variant="body1">Payment Type</Typography>
                </Grid>
                <Grid item md={2} xs={12}>
                  <RadioGroup
                    row
                    defaultValue={values.payment_request_type}
                    name="payment_request_type"
                    onClick={(e) => handleChange(e)}
                    className={radioGroupClass}
                  >
                    <FormControlLabel
                      disabled={!!prId}
                      value={`${PAYMENT_REQUEST_TYPE.ADVANCE}`}
                      control={<Radio color="primary" />}
                      label="Advance"
                    />
                    <FormControlLabel
                      disabled={!!prId}
                      value={`${PAYMENT_REQUEST_TYPE.BILL}`}
                      control={<Radio color="primary" />}
                      label="Bill"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
              {values.payment_request_type ===
                `${PAYMENT_REQUEST_TYPE.BILL}` && (
                <Grid container className={marginTopSpace}>
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Bill Date</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FieldDatePicker
                      name="bill_date"
                      placeholder="Bill Date"
                      variant="inline"
                      autoOk
                      inputVariant="outlined"
                      disabled={shouldDisableFormFields}
                      textFieldProps={{ size: 'small' }}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid
                container
                direction="row"
                alignItems="center"
                className={marginTopSpace}
              >
                <Grid item md={2} xs={12}>
                  <Typography variant="body1">Vendor</Typography>
                </Grid>
                <Grid item md={2} xs={12}>
                  <FieldCombo
                    name="vendor"
                    placeholder="Select Vendor"
                    variant="outlined"
                    inputMinLength={1}
                    options={prVendors.items || []}
                    disabled={shouldDisableFormFields}
                    onChange={({ id = null }) => setVendorId(id)}
                  />
                </Grid>
              </Grid>
              {values.payment_request_type ===
                `${PAYMENT_REQUEST_TYPE.ADVANCE}` && (
                <AdvancePaymentRequest
                  approverList={approverList}
                  vendorId={vendorId}
                  transportCostHeadId={transportCostHeadId}
                  disableFormFields={shouldDisableFormFields}
                  {...values}
                />
              )}
              {values.payment_request_type ===
                `${PAYMENT_REQUEST_TYPE.BILL}` && (
                <BillPaymentRequest
                  approverList={approverList}
                  vendorId={vendorId}
                  tripDetails={tripDetails}
                  transportCostHeadId={transportCostHeadId}
                  disableFormFields={shouldDisableFormFields}
                  {...values}
                />
              )}
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

export default AddEditPaymentRequest;
