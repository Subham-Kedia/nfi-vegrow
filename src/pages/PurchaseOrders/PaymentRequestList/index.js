import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Add as AddIcon,
  ArrowDownward as ArrowDown,
  ArrowUpward as ArrowUp,
  NoteTwoTone as NoteIcon,
} from '@mui/icons-material';
import { Grid, Link, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { AppButton, GridListView, Text } from 'Components';
import { getPaymentListing } from 'Services/payments';
import { STATUS } from 'Utilities/constants/paymentRequest';
import { getFormattedDate, getFormattedDateTime } from 'Utilities/dateUtils';

import ShipmentModalButton from '../components/ShipmentModalButton';

const COLUMNS = [
  {
    header: {
      label: 'Id',
      style: {},
    },
    key: 'identifier',
    props: { md: 1, xs: 12 },
    render: (data, props) => (
      <Grid container alignItems="center">
        {data.priority === 1 ? (
          <ArrowUp style={{ color: 'red', marginRight: '1rem' }} />
        ) : (
          <ArrowDown style={{ color: 'green', marginRight: '1rem' }} />
        )}
        {(data.status === STATUS.PENDING || data.status === STATUS.REJECTED) &&
        data?.is_editable ? (
          <Link
            href={`/app/purchase-order/${props.paramId}/payment-requests/${data.id}/edit`}
          >
            {data.identifier}
          </Link>
        ) : (
          data.identifier
        )}
      </Grid>
    ),
  },
  {
    header: {
      label: 'Shipment',
      style: { paddingLeft: '0.5rem' },
    },
    props: { md: 1, xs: 12 },
    render: ({ nfi_shipments, nfi_purchase_order_id }) => (
      <>
        {nfi_shipments?.length ? (
          <ShipmentModalButton
            identifier={nfi_shipments[0].identifier}
            shipmentId={nfi_shipments[0].id}
            poId={nfi_purchase_order_id}
          />
        ) : (
          <Text pl={1}>N/A</Text>
        )}
      </>
    ),
  },
  {
    header: {
      label: 'Type',
      style: {},
    },
    key: 'payment_request_type_label',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <>
        <Typography variant="body1">
          {data.payment_request_type_label}
        </Typography>
        <Typography variant="body1">({data.category_label})</Typography>
      </>
    ),
  },
  {
    header: {
      label: 'Vendor',
      style: {},
    },
    key: 'vendor',
    render: (data, props) => (
      <Grid container>
        <Grid item md={12} xs={12} style={{ marginBottom: '0.5rem' }}>
          <Typography
            variant="body1"
            onClick={() => props.uploadDocuments(data?.vendor || {})}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            {data?.vendor?.name || ''}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography
            variant="caption"
            color={
              data?.vendor?.bank_status === 'Verified' ? 'primary' : 'secondary'
            }
            className={props?.classes?.status}
          >
            KYC {data?.vendor?.kyc_status}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography
            variant="caption"
            color={
              data?.vendor?.bank_status === 'Verified' ? 'primary' : 'secondary'
            }
            className={props?.classes?.status}
          >
            Bank {data?.vendor?.bank_status}
          </Typography>
        </Grid>
      </Grid>
    ),
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Value',
      style: {},
    },
    key: 'amount',
    props: { md: 1, xs: 12 },
    render: (data) => <Typography>₹ {data?.amount}</Typography>,
  },
  {
    header: {
      label: 'Balance Advance',
      style: {},
    },
    key: 'outstanding_advance',
    props: { md: 1, xs: 12 },
    render: (data) => <Typography>₹ {data.outstanding_advance}</Typography>,
  },
  {
    header: {
      label: 'Due Date',
      style: {},
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
      style: {},
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
      style: {},
    },
    key: 'id',
    render: (data) => (
      <>
        {data.finance_approver_name && (
          <>
            <Typography variant="body1">
              (B) {data.approver_name} <br />
            </Typography>
            <Typography variant="caption">
              {getFormattedDateTime(data.approved_date)}
            </Typography>
          </>
        )}
        {/* Check if data.finance_approver_name is not null and render below */}
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
      style: {},
    },
    key: 'id',
    render: (data) => (
      <>
        <Typography variant="body1">
          {data?.customer && <>Paid By : {data?.customer?.name}</>}
          {!data?.customer && getFormattedDateTime(data.paid_date)}
        </Typography>
        {data.bill_date ? (
          <>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              Bill Date:
            </Typography>
            <Typography variant="body1">
              {getFormattedDateTime(data.bill_date)}
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
      style: {},
    },
    key: 'status_label',
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Attachments',
      style: {},
    },
    key: 'id',
    render: (data) => {
      return (
        <Grid container direction="row" spacing={1}>
          {data?.bill && (
            <Grid item md={6}>
              <Grid
                container
                direction="column"
                justifyContent="center"
                align="center"
              >
                <Grid item>
                  <NoteIcon />
                </Grid>
                <Link href={data?.bill} target="_blank" download>
                  Bill
                </Link>
              </Grid>
            </Grid>
          )}
        </Grid>
      );
    },
    props: { md: 1, xs: 12 },
  },
];

const PaymentRequestList = () => {
  const { poId = null } = useParams();
  const [paymentList, setPaymentList] = useState([]);

  const paramId = JSON.parse(poId);

  const loadPaymentListing = () => {
    getPaymentListing({ non_fruit_purchase_order_id: poId }).then((res) =>
      setPaymentList(res.items),
    );
  };

  useEffect(() => {
    if (poId) {
      loadPaymentListing();
    }
  }, [poId]);

  const navigate = useNavigate();

  const createPaymentRequest = () => {
    navigate(`/app/purchase-order/${paramId}/payment-requests/create`);
  };

  const uploadDocuments = (prVendors) => {
    window.open(`${API.CRMUrl}partners/${prVendors?.id}`);
  };

  const downloadBill = ({ id }) => {
    window.open(`${API.CRMUrl}payment_requests/${id}/generate_bill.pdf`);
  };

  return (
    <PageLayout
      title={`Payment Request for PO: ${poId}`}
      titleComponent={
        <AppButton onClick={createPaymentRequest} startIcon={<AddIcon />}>
          New Payment Request
        </AppButton>
      }
    >
      <PageLayout.Body>
        {paymentList.length ? (
          <GridListView
            data={paymentList}
            columns={COLUMNS}
            cellProps={{ downloadBill, poId, paramId, uploadDocuments }}
          />
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: '100%' }}
          >
            <Typography variant="h5" gutterBottom>
              No Payment Request Available
            </Typography>
          </Grid>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PaymentRequestList;
