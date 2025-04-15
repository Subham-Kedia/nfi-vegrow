import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, InputAdornment, Typography } from '@mui/material';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, AppLoader, ImageThumb } from 'Components';
import {
  FieldCombo,
  FieldDatePicker,
  FieldInput,
  FieldSwitch,
} from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import RouteTransformer from 'Routes/routeTransformer';
import {
  createPaymentRequest,
  getPaymentListing,
  updatePaymentRequest,
} from 'Services/payments';
import { notifyUser, toFixedNumber } from 'Utilities';
import {
  PAYMENT_REQUEST_PRIORITY,
  PAYMENT_REQUEST_TYPE,
  STATUS,
} from 'Utilities/constants/paymentRequest';
import imageDirectUpload from 'Utilities/directUpload';
import { validateMax, validateMaxOrEquals } from 'Utilities/formvalidation';

import UploadBillModal from '../../PurchaseOrders/PaymentRequestAddEdit/UploadBillModal';
import { classes } from '../style';

const BillPaymentRequest = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [showUploadBillModal, setShowUploadBillModal] = useState(false);
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [advancePayment, setAdvancePayment] = useState([]);
  const {
    approverList,
    vendorId,
    transportCostHeadId,
    tripDetails = {},
    disableFormFields,
  } = props;
  const params = useParams();
  const { tripId, prId = null } = params;
  const navigate = useNavigate();
  const { userInfo: { id: userId } = {} } = useSiteValue();

  const {
    marginTopSpace,
    heavyFontTopMargin,
    marginUpCombination,
    heavyUpperFont,
    heavyFont,
    fullWidth,
    marginCombination,
  } = classes();

  const AmountField = ({ labelTxt, FieldName }) => {
    return (
      <Grid container className={marginTopSpace}>
        <Grid item md={2} xs={12}>
          <Typography variant="body1">{labelTxt}</Typography>
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldInput
            name={FieldName}
            size="small"
            type="number"
            placeholder={labelTxt}
            variant="outlined"
            disabled={disableFormFields}
          />
        </Grid>
      </Grid>
    );
  };

  useEffect(() => getAdvancePayment(), [tripId, vendorId]);

  const getAdvancePayment = () => {
    setLoading(true);
    getPaymentListing({
      nfi_trip_id: tripId,
      payment_request_type: PAYMENT_REQUEST_TYPE.ADVANCE,
      status: [STATUS.APPROVED, STATUS.PAID],
      vendor_id: vendorId,
    })
      .then((res) => {
        const adjustmentData = res.items
          .map((item) => {
            const { advance_amount_adjustments = [] } = props;
            const foundAdjustment =
              advance_amount_adjustments?.find(
                (ad) => ad.from_payment_request_id === item.id,
              ) || {};
            return {
              ...foundAdjustment,
              from_payment_request_id: item.id,
              ...(params.prId ? { to_payment_request_id: +params.prId } : {}),
              amount: params.prId
                ? +foundAdjustment.amount || 0
                : (+foundAdjustment.amount || 0) + +item.remaining_amount,
              adjust: {
                adjust: params.prId ? !+item.remaining_amount : true,
              },
              total_adjustment_amount:
                (+foundAdjustment.amount || 0) + +item.remaining_amount,
            };
          })
          .filter((ad) => ad.total_adjustment_amount > 0);
        setAdvancePayment(adjustmentData);
      })
      .finally(() => setLoading(false));
  };

  const submitBillPayment = async (values) => {
    setFormSubmitting(true);
    const {
      approvers = [],
      advance_amount_adjustments,
      payment_request_bill: { 0: file } = [],
      bill_number,
      priority,
      amount,
      ...rest
    } = values;
    const { data: tripBillPRData = {} } = (await imageDirectUpload(file)) || {};

    const defaultData = {
      created_date: Date.now(),
      payment_request_type: PAYMENT_REQUEST_TYPE.BILL,
      creator_id: userId,
      cost_head_id: transportCostHeadId,
      priority: priority
        ? PAYMENT_REQUEST_PRIORITY.HIGH
        : PAYMENT_REQUEST_PRIORITY.LOW,
      nfi_trip_id: +tripId,
      ...(vendorId ? { vendor_id: vendorId } : {}),
    };

    const payment_request = {
      ...defaultData,
      ...rest,
      bill: tripBillPRData.signed_id,
      bill_number,
      status: STATUS.PENDING,
      advance_amount_adjustments: (
        advance_amount_adjustments?.filter((adv) => adv.amount) || []
      )?.map(({ from_payment_request_id, amount: value }) => ({
        from_payment_request_id,
        amount: value,
      })),
      amount: values.is_partial_bill
        ? amount
        : calculateTotalPayment(values) || amount || 0,
      approver_ids: approvers.map((ap) => ap.id) || [],
    };
    const processPaymentRequest = params.prId
      ? updatePaymentRequest
      : createPaymentRequest;

    processPaymentRequest({ payment_request }, params.prId)
      .then(() => {
        notifyUser(
          `Payment Request ${prId ? 'updated' : 'created'} successfully.`,
        );
        returnToListingPage();
      })
      .finally(() => setFormSubmitting(false));
  };

  const returnToListingPage = () => {
    navigate(`/app/${RouteTransformer.getPrListingLink(tripId)}`);
  };

  const calculateTotalPayment = (values) => {
    const transportationCost = getTripPayment();
    const advanceAmount = toFixedNumber(
      values.advance_amount_adjustments?.reduce(
        (acc, val) => acc + (val.amount || 0),
        0,
      ) || 0,
    );
    const deduction = values.adjusted_amount || 0;
    const inam = values.inam_amount || 0;
    const demurrage = values.demurrage_amount || 0;

    return transportationCost - advanceAmount - deduction + inam + demurrage;
  };

  const getMetaData = (key, vendorKey = 'vendor_id') => {
    if (!vendorId) return 0;
    const { [key]: data } = tripDetails;
    return data.find((meta) => meta[vendorKey] === vendorId) || {};
  };

  const getTripPayment = () => {
    return getMetaData('trip_meta_vendorwise_amount').total_amount || 0;
  };

  const toggleShowUploadBillModal = () => {
    setShowUploadBillModal(!showUploadBillModal);
  };

  if (isLoading) {
    return <AppLoader />;
  }

  const isDisableSave = (values) =>
    !(
      values.bill_date &&
      values.approvers?.length &&
      values.due_date &&
      (values.payment_request_bill?.length || values.bill)
    );

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...props, advance_amount_adjustments: advancePayment }}
      onSubmit={submitBillPayment}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Grid container>
          <Grid container className={heavyFontTopMargin}>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">Trip Payment</Typography>
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">{getTripPayment()}</Typography>
            </Grid>
          </Grid>
          <AmountField labelTxt="Deduction" FieldName="adjusted_amount" />
          <AmountField labelTxt="Inam" FieldName="inam_amount" />
          <AmountField labelTxt="Demurrage" FieldName="demurrage_amount" />

          {values.advance_amount_adjustments?.length > 0 && (
            <FieldArray
              name="advance_amount_adjustments"
              render={() =>
                values.advance_amount_adjustments.map((advance, index) => {
                  return (
                    <Grid
                      container
                      alignItems="center"
                      key={index}
                      className={marginTopSpace}
                    >
                      <Grid item md={2} xs={12}>
                        <Typography variant="body1">
                          Advance {index + 1}
                        </Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FieldInput
                          name={`advance_amount_adjustments.${index}.amount`}
                          size="small"
                          type="number"
                          label=""
                          placeholder="Advance"
                          variant="outlined"
                          validate={validateMaxOrEquals(
                            advance.total_adjustment_amount,
                          )}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                /{advance.total_adjustment_amount}
                              </InputAdornment>
                            ),
                          }}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  );
                })
              }
            />
          )}
          <Grid container className={marginUpCombination}>
            <Grid item md={2} xs={12}>
              <Typography variant="h6" className={heavyUpperFont}>
                Total after adjustment
              </Typography>
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography variant="h6" color="primary" className={heavyFont}>
                ₹ {calculateTotalPayment(values)}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems="center"
            spacing={1}
            className={marginTopSpace}
          >
            <Grid item md={2} xs={12}>
              <Typography variant="body1">Send Partial Payment</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">No</Typography>
            </Grid>
            <FieldSwitch
              size="medium"
              name="is_partial_bill"
              checked={values.is_partial_bill}
              labelPlacement="end"
              disabled={!!prId || disableFormFields}
              InputLabelProps={{
                fullWidth: false,
              }}
            />
            <Grid item>
              <Typography variant="body1">Yes</Typography>
            </Grid>
          </Grid>
          {values.is_partial_bill && (
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
                  validate={validateMax(calculateTotalPayment(values))}
                  disabled={disableFormFields}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        /{calculateTotalPayment(values)}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}
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
              <Typography variant="body1">Comments</Typography>
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
              <Typography variant="body1">Attach Bills</Typography>
            </Grid>
            <Grid item md={2} xs={12}>
              <AppButton
                variant="contained"
                color="primary"
                className={marginCombination}
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
            alignItems="center"
          >
            <Grid item>
              <Grid container>
                {(values.bill || values.payment_request_bill) && (
                  <ImageThumb
                    url={values.bill || ''}
                    file={values.payment_request_bill?.[0]}
                    title={
                      values.bill_number && `Bill.No.-${values.bill_number}`
                    }
                  />
                )}
              </Grid>
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
                onClick={handleSubmit}
                loading={isFormSubmitting}
                disabled={isDisableSave(values) || disableFormFields}
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

export default BillPaymentRequest;
