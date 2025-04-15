import NoteIcon from '@mui/icons-material/NoteTwoTone';
import { Grid, Link, Typography } from '@mui/material';
import { AppButton } from 'Components';
import ViewPaymentRequest from 'Components/PaymentRequest/ViewPaymentRequest';
import RouteTransformer from 'Routes/routeTransformer';
import { toFixedNumber } from 'Utilities';
import {
  PAYMENT_REQUEST_PRIORITY,
  PAYMENT_REQUEST_TYPE,
  STATUS,
} from 'Utilities/constants/paymentRequest';
import { getFormattedDate, getFormattedDateTime } from 'Utilities/dateUtils';

import {
  BoldText,
  BottomSpacedGrid,
  FlexButton,
  StyledArrowDown,
  StyledArrowUp,
  UnderlinedTextPointer,
} from './styled';

export const PaymentRequestListColumns = [
  {
    header: {
      label: 'Id',
    },
    key: 'identifier',
    props: { md: 1, xs: 12 },
    render: (data, props) => {
      const isPREditable =
        (data.status === STATUS.PENDING || data.status === STATUS.REJECTED) &&
        data.is_editable;
      let hrefURL = '';
      if (isPREditable) {
        hrefURL = data.parent_bill_id
          ? `/app/${RouteTransformer.getEditBalancePrLink(
              props.tripId,
              data.parent_bill_id,
              data.id,
            )}`
          : `/app/${RouteTransformer.getEditPrLink(props.tripId, data.id)}`;
      }
      return (
        <Grid container alignItems="center">
          {data.priority === PAYMENT_REQUEST_PRIORITY.HIGH ? (
            <StyledArrowUp />
          ) : (
            <StyledArrowDown />
          )}
          {isPREditable ? (
            <Link href={hrefURL}>{data.identifier}</Link>
          ) : (
            <Typography variant="subtitle6">{data.identifier}</Typography>
          )}
        </Grid>
      );
    },
  },
  {
    header: {
      label: 'Type',
    },
    key: 'payment_request_type_label',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <>
        <Typography variant="body1">
          {data.payment_request_type_label}
        </Typography>
        <Typography variant="caption">({data.category_label})</Typography>
      </>
    ),
  },
  {
    header: {
      label: 'Vendor',
    },
    key: 'vendor',
    render: (data, props) => {
      const {
        vendor,
        vendor: { name, bank_status, kyc_status },
      } = data;
      return (
        <Grid container>
          <BottomSpacedGrid item md={12} xs={12}>
            <UnderlinedTextPointer
              variant="body1"
              onClick={() => props.uploadDocuments(vendor || {})}
            >
              {name || ''}
            </UnderlinedTextPointer>
          </BottomSpacedGrid>
          <Grid item md={12} xs={12}>
            <Typography
              variant="caption"
              color={bank_status === 'Verified' ? 'primary' : 'secondary'}
            >
              KYC {kyc_status}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography
              variant="caption"
              color={bank_status === 'Verified' ? 'primary' : 'secondary'}
            >
              Bank {bank_status}
            </Typography>
          </Grid>
        </Grid>
      );
    },
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Value',
    },
    key: 'amount',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography>
        {data.payment_request_type === PAYMENT_REQUEST_TYPE.BILL ? (
          <ViewPaymentRequest
            data={data}
            value={toFixedNumber(data.bill_parent_cost, 2)}
          />
        ) : (
          'NA'
        )}
      </Typography>
    ),
  },
  {
    header: {
      label: 'Requested',
    },
    key: 'amount',
    props: { md: 1, xs: 12 },

    render: (data) => (
      <Typography>₹ {toFixedNumber(data.amount, 2)}</Typography>
    ),
  },
  {
    header: {
      label: 'Balance Advance',
    },
    key: 'outstanding_advance',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography>₹ {toFixedNumber(data.outstanding_advance, 2)}</Typography>
    ),
  },
  {
    header: {
      label: 'Due Date',
    },
    key: 'due_date',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">{getFormattedDate(data.due_date)}</Typography>
    ),
  },
  {
    header: {
      label: 'Created',
    },
    key: 'id',
    render: (data) => (
      <>
        <Typography variant="body1">{data.creator_name}</Typography>
        <Typography variant="body1">
          {getFormattedDateTime(data.created_date)}
        </Typography>
      </>
    ),
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Approved',
    },
    key: 'id',
    render: (data) => (
      <>
        <Typography variant="body1">(B) {data.approver_name}</Typography>
        <Typography variant="caption">
          {getFormattedDateTime(data.approved_date)}
        </Typography>
        {data.finance_approver_name && (
          <>
            <Typography variant="body1">
              (F) {data.finance_approver_name}
            </Typography>
            <Typography variant="caption">
              {getFormattedDateTime(data.finance_approved_date)}
            </Typography>
          </>
        )}
      </>
    ),
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Paid At',
    },
    key: 'id',
    render: (data) => (
      <>
        <Typography variant="body1">
          {data.customer && <>Paid By : {data.customer.name}</>}
          {!data.customer && getFormattedDateTime(data.paid_date)}
        </Typography>
        {data.bill_date ? (
          <>
            <BoldText variant="body2">Bill Date:</BoldText>
            <Typography variant="body1">
              {getFormattedDate(data.bill_date)}
            </Typography>
          </>
        ) : (
          <></>
        )}
      </>
    ),
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Status',
    },
    key: 'status_label',
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Actions',
    },
    key: 'id',
    render: (data, props) => (
      <>
        {data.is_partial_bill && !props.hasLimitedAccessToTrips && (
          <AppButton
            onClick={() =>
              props.navigate(
                `/app/${RouteTransformer.getAddBalancePrLink(
                  props.tripId,
                  data.id,
                )}`,
              )
            }
            size="medium"
          >
            + balance
          </AppButton>
        )}
        <Grid container direction="row" spacing={1}>
          {data.bill && (
            <Grid item md={6}>
              <Grid
                container
                direction="column"
                justifyContent="center"
                align="center"
              >
                <FlexButton href={data.bill} target="_blank" download>
                  <NoteIcon /> Bill
                </FlexButton>
              </Grid>
            </Grid>
          )}
        </Grid>
      </>
    ),
    props: { md: 1, xs: 12 },
  },
];
