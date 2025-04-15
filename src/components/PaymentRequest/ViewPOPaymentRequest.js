import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PageLayout from 'App/PageLayout';
import { AppLoader, CustomTable as Table } from 'Components';
import { getPaymentRequestById } from 'Services/payments';
import { getFormattedDate, getFormattedDateTime } from 'Utilities/dateUtils';

import { ShipmentWrapper } from './styled';

const COLUMNS = [
  {
    key: 'label',
    header: 'Lots (Labels)',
    footer: 'Total',
    style: {
      maxWidth: '290px',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    render: ({ data }) => <>{data}</>,
  },
  {
    key: 'accounted_weight_in_kgs',
    header: 'Weight (Kgs)',
    footer: 'total_accounted_weight_in_kgs',
    align: 'center',
    render: ({ data, rowData }) => (
      <>
        {data || 0}
        <Typography
          variant="caption"
          component="div"
          className="disabled-text"
          color="textPrimary"
        >
          ({rowData.quantity || 0} X{' '}
          {rowData.average_accounted_package_weight_in_kgs || 0}{' '}
          {rowData.partial_weight > 0 && `+ ${rowData.partial_weight}`})
        </Typography>
      </>
    ),
    style: {
      maxWidth: '90px',
    },
  },
  {
    key: 'value',
    header: 'Total Price (₹)',
    footer: 'total_shipment_value',
    align: 'center',
    render: ({ data, rowData }) => (
      <>
        ₹{data || 0}
        <Typography
          variant="caption"
          component="div"
          className="disabled-text"
          color="textPrimary"
        >
          ₹{rowData.unit_price || 0} / kg
        </Typography>
      </>
    ),
    style: {
      minWidth: '90px',
    },
  },
];
const ViewPOPaymentRequest = ({ prId }) => {
  const [isLoading, setLoading] = useState(false);
  const [shipmentsPayment, setShipmentsPayment] = useState([]);
  const [totalPaymentValue, setTotalPaymentValue] = useState(0);
  const [paymentRequest, setPaymentRequest] = useState({});

  useEffect(() => {
    prId && getPaymentRequestDetails(prId);
  }, []);

  const getPaymentRequestDetails = (prId) => {
    setLoading(true);
    getPaymentRequestById(+prId)
      .then((res) => {
        setShipmentsPayment(res.shipments);
        setPaymentRequest(res);

        const totalShipmentValue =
          res?.shipments?.reduce(
            (acc, val) => acc + val.total_shipment_value,
            0,
          ) || res.amount;
        setTotalPaymentValue(totalShipmentValue);
      })
      .finally(() => setLoading(false));
  };

  return isLoading ? (
    <AppLoader />
  ) : (
    <PageLayout>
      <PageLayout.Body>
        <Grid container justifyContent="center">
          <Grid item md={10} xs={12} style={{ padding: '1rem' }}>
            <Paper style={{ height: '100%', padding: '1rem' }}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="button">Vendor:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    {paymentRequest?.vendor?.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="button">Approver:</Typography>
                </Grid>
                {paymentRequest?.approvers?.map(({ name }, index) => (
                  <Grid item>
                    <Typography variant="body2">
                      {index > 0 ? ' | ' : ''}
                      {name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="button">Due date:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    {getFormattedDateTime(paymentRequest.due_date)}
                  </Typography>
                </Grid>
              </Grid>
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
              <Grid>
                {shipmentsPayment.length > 0 &&
                  shipmentsPayment?.map((s) => {
                    return (
                      <ShipmentWrapper key={s.id}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            component="label"
                            className="title"
                            color="textPrimary"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <strong>Shipment - {s.shipment_identifier}</strong>
                          </Typography>
                        </div>
                        <Table
                          size="small"
                          isFooter
                          footerSummarydata={s}
                          sticky
                          columns={COLUMNS}
                          data={
                            s.lots.filter(
                              (item) =>
                                item.quantity_with_partial_weight &&
                                item.quantity_with_partial_weight !== 0,
                            ) || []
                          }
                          dataKey="id"
                          className="shipment-table"
                        />
                      </ShipmentWrapper>
                    );
                  })}
              </Grid>
              <Grid container>
                {paymentRequest?.advance_amount_adjustments?.length > 0 && (
                  <>
                    <Grid item md={2} xs={12}>
                      <Typography
                        variant="button"
                        className="title"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        Adjustments
                      </Typography>
                    </Grid>
                    <Grid item md={10} xs={12}>
                      {paymentRequest?.advance_amount_adjustments?.map(
                        (advance, index) => (
                          <Grid
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                            spacing={1}
                            key={index}
                          >
                            <Grid item md={4} xs={12}>
                              <Typography variant="body1">
                                Advance from PO-{advance?.purchase_order_id} PR-
                                {advance?.from_payment_request_id}
                              </Typography>
                            </Grid>
                            <Grid item md={3} xs={12}>
                              <TextField
                                size="small"
                                placeholder="Advance"
                                variant="outlined"
                                disabled
                                style={{ width: '100%' }}
                                value={advance.amount}
                              />
                            </Grid>
                          </Grid>
                        ),
                      )}
                    </Grid>
                  </>
                )}
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
                    To be paid(After adjustments)
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
                    ₹{' '}
                    {totalPaymentValue -
                      (paymentRequest?.advance_amount_adjustments?.reduce(
                        (acc, val) => acc + (val?.amount || 0),
                        0,
                      ) || 0)}
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

export default ViewPOPaymentRequest;
