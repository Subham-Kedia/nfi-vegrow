import { useEffect, useState } from 'react';
import NoteIcon from '@mui/icons-material/NoteTwoTone';
import { Grid, Link, Paper, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { AppLoader, GridListView } from 'Components';
import ViewDriverDetails from 'Components/PaymentRequest/ViewDriverDetails';
import { getPaymentRequestById } from 'Services/payments';
import { getFormattedDate } from 'Utilities/dateUtils';

const COLUMNS = [
  {
    header: {
      label: 'Delivery',
      style: {},
    },
    key: 'recipient_name',
    props: { md: 3, xs: 12 },
    render: (data = {}) => (
      <>
        <Typography variant="body1">{data.recipient_name}</Typography>
        <Typography variant="body1">
          {data.sale_order_id ? `SO-${data.sale_order_id}` : data.identifier}
        </Typography>
      </>
    ),
  },
  {
    header: {
      label: 'Gross Weight',
      style: {},
    },
    key: 'gross_weight',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">
        {data.gross_weight ? `${data.gross_weight} Kgs` : 'NA'}
      </Typography>
    ),
  },
  {
    header: {
      label: 'Tare Weight',
      style: {},
    },
    key: 'tare_weight',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">
        {data.tare_weight ? `${data.tare_weight} Kgs` : 'NA'}
      </Typography>
    ),
  },
  {
    header: {
      label: 'Net Weight',
      style: {},
    },
    key: 'tare_weight',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">
        {data.gross_weight && data.tare_weight
          ? `${data.gross_weight - data.tare_weight}  Kgs`
          : 'NA'}
      </Typography>
    ),
  },
  {
    header: {
      label: 'Quantity',
      style: {},
    },
    key: 'total_sent_quantity',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <>
        <Typography variant="body1">{data.total_sent_quantity} Unit</Typography>
        <Typography variant="caption">{data.sent_weight_in_kgs} Kgs</Typography>
      </>
    ),
  },
  {
    header: {
      label: 'Gap',
      style: {},
    },
    key: 'total_quantity_gap',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <>
        <Typography variant="body1">{data.total_quantity_gap} Unit</Typography>
        <Typography variant="caption">{data.total_weight_gap} Kgs</Typography>
      </>
    ),
  },
  {
    header: {
      label: 'Customer Payment',
      style: {},
    },
    key: 'customer_amount',
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Attachments',
      style: {},
    },
    key: 'recipient_name',
    props: { md: 2, xs: 12 },
    render: (data) =>
      data.challan ? (
        <Grid container alignItems="center" spacing={3}>
          {data.challan && (
            <Grid item>
              <Grid container direction="column" justifyContent="center">
                <Grid item>
                  <NoteIcon />
                </Grid>
                <Link href={data.challan} target="_blank" download>
                  Challan
                </Link>
              </Grid>
            </Grid>
          )}
          {data.arrival_loaded_truck_weighment && (
            <Grid item>
              <Grid container direction="column" justifyContent="center">
                <Grid item>
                  <NoteIcon />
                </Grid>
                <Link
                  href={data.arrival_loaded_truck_weighment}
                  target="_blank"
                  download
                >
                  Weightment
                </Link>
              </Grid>
            </Grid>
          )}
        </Grid>
      ) : (
        <></>
      ),
  },
];

const WEIGHMENT_COLUMNS = [
  {
    header: {
      label: 'Pickup Location',
      style: {},
    },
    key: 'pickup_location',
    props: { md: 4, xs: 12 },
    render: (data) => (
      <Typography variant="body1">{data.pickup_location}</Typography>
    ),
  },
  {
    header: {
      label: 'Gross Weight',
      style: {},
    },
    key: 'gross_weight',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">
        {data.gross_weight ? `${data.gross_weight} Kgs` : 'NA'}
      </Typography>
    ),
  },
  {
    header: {
      label: 'Tare Weight',
      style: {},
    },
    key: 'tare_weight',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">
        {data.tare_weight ? `${data.tare_weight} Kgs` : 'NA'}
      </Typography>
    ),
  },
  {
    header: {
      label: 'Net Weight',
      style: {},
    },
    key: 'tare_weight',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">
        {data.gross_weight && data.tare_weight
          ? `${data.gross_weight - data.tare_weight}  Kgs`
          : 'NA'}
      </Typography>
    ),
  },
  {
    header: {
      label: 'Weighment Slip',
      style: {},
    },
    key: 'dispatch_check_weighment',
    props: { md: 3, xs: 12 },
    render: (data) => (
      <Grid container>
        {data.dispatch_check_weighment && (
          <Link href={data.dispatch_check_weighment} target="_blank" download>
            <NoteIcon />
          </Link>
        )}
        {data.arrival_loaded_truck_weighment && (
          <Link
            href={data.arrival_loaded_truck_weighment}
            target="_blank"
            download
          >
            <NoteIcon />
          </Link>
        )}
      </Grid>
    ),
  },
];

const ViewTripPaymentRequest = ({ prId }) => {
  const [isLoading, setLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [pickup, setPickup] = useState([]);
  const [paymentRequest, setPaymentRequest] = useState({});
  const [trip, setTrip] = useState({});

  const getTripMetaData = () => {
    const { trip_metadata } = trip;
    const { vendor } = paymentRequest;
    return trip_metadata?.find((meta) => meta?.partner_id === vendor?.id) || {};
  };

  const getTripPayment = () => {
    return getTripMetaData().transportation_cost_in_rs || 0;
  };

  useEffect(() => {
    prId && getPaymentRequestDetails(prId);
  }, []);

  const getPaymentRequestDetails = (prId) => {
    setLoading(true);
    getPaymentRequestById(+prId)
      .then((res) => {
        const { trip = {} } = res;
        setPaymentRequest(res);
        setTrip(trip || {});
        setDeliveries(trip?.deliveries || []);
        setPickup(trip?.pickup_details || []);
      })
      .finally(() => setLoading(false));
  };

  const calculateTotalPayment = () => {
    const advanceAmount =
      paymentRequest?.advance_amount_adjustments?.reduce(
        (acc, val) => acc + (val?.amount || 0),
        0,
      ) || 0;
    const deduction = paymentRequest.adjusted_amount || 0;
    const inam = paymentRequest.inam_amount || 0;
    const demurrage = paymentRequest.demurrage_amount || 0;
    const customerPayment =
      deliveries?.reduce((acc, d) => (acc += +d.customer_amount || 0), 0) || 0;

    return (
      getTripPayment() -
      customerPayment -
      advanceAmount -
      deduction +
      inam +
      demurrage
    );
  };

  return isLoading ? (
    <AppLoader />
  ) : (
    <PageLayout>
      <PageLayout.Body>
        <Grid container justifyContent="center">
          <Grid item md={10} xs={12} style={{ padding: '1rem' }}>
            <Paper style={{ height: '100%', padding: '1rem' }}>
              <ViewDriverDetails
                trip={paymentRequest?.trip || {}}
                trip_meta_info={getTripMetaData() || {}}
              />
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="button">Bill:</Typography>
                </Grid>
                {paymentRequest.bill && (
                  <Grid item>
                    <Link href={paymentRequest.bill} target="_blank" download>
                      Download bill
                    </Link>
                    <Typography variant="body" style={{ marginLeft: '1rem' }}>
                      {paymentRequest.bill_date
                        ? getFormattedDate(paymentRequest.bill_date)
                        : ''}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid container>
                {pickup && (
                  <Grid item md={12}>
                    <Typography
                      variant="h6"
                      className="title"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '1rem 0',
                        fontWeight: 'bold',
                      }}
                    >
                      Pickup Weighment Details
                    </Typography>
                    <GridListView
                      data={[pickup]}
                      columns={WEIGHMENT_COLUMNS}
                      cellProps={{}}
                    />
                  </Grid>
                )}
              </Grid>
              {deliveries.length ? (
                <Grid container direction="column">
                  <Grid item>
                    <Typography
                      variant="h6"
                      className="title"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '1rem 0',
                        fontWeight: 'bold',
                      }}
                    >
                      Deliveries
                    </Typography>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Grid item md={12} xs={12}>
                      <GridListView data={deliveries} columns={COLUMNS} />
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
              <Grid container>
                <Grid item md={12} xs={12}>
                  <Typography
                    variant="h6"
                    className="title"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      margin: '1rem 0',
                      fontWeight: 'bold',
                    }}
                  >
                    Payment Details
                  </Typography>
                </Grid>
                <Grid container alignItems="center" justifyContent="flex-end">
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Trip Payment</Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography variant="body1" style={{ textAlign: 'right' }}>
                      {getTripPayment()}
                    </Typography>
                  </Grid>
                </Grid>
                {paymentRequest?.advance_amount_adjustments?.length > 0 &&
                  paymentRequest?.advance_amount_adjustments?.map(
                    (advance, index) => (
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Grid item md={2} xs={12}>
                          <Typography variant="body1">
                            Advance {index + 1}
                          </Typography>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography
                            variant="body1"
                            style={{ textAlign: 'right' }}
                          >
                            {advance.amount}
                          </Typography>
                        </Grid>
                      </Grid>
                    ),
                  )}
                <Grid container alignItems="center" justifyContent="flex-end">
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Adjusted Amount</Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography variant="body1" style={{ textAlign: 'right' }}>
                      {paymentRequest.adjusted_amount || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="flex-end">
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Customer Payment</Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography variant="body1" style={{ textAlign: 'right' }}>
                      {deliveries?.reduce(
                        (acc, d) => (acc += d.customer_amount),
                        0,
                      ) || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="flex-end">
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Inam Amount</Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography variant="body1" style={{ textAlign: 'right' }}>
                      {paymentRequest.inam_amount || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="flex-end">
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Demurrage Amount</Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography variant="body1" style={{ textAlign: 'right' }}>
                      {paymentRequest.demurrage_amount || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container style={{ margin: '2rem 0' }}>
                <Grid item md={8} xs={12}>
                  <Typography
                    variant="h5"
                    style={{
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                    }}
                  >
                    Total after adjustment
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12} justifyContent="flex-end">
                  <Typography
                    variant="h5"
                    color="primary"
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    ₹ {calculateTotalPayment()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default ViewTripPaymentRequest;
