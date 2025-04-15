import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DialogContentText, Grid, Typography } from '@mui/material';
import {
  AppButton,
  AppLoader,
  ConfirmationDialog,
  DeleteButton,
  EditButton,
  GridListView,
} from 'Components';
import { updateShipmentStatus } from 'Services/shipment';
import {
  deleteTransferOrder,
  getTransferOrderById,
} from 'Services/transferOrder';
import { notifyUser } from 'Utilities';
import { SHIPMENT_STATUS } from 'Utilities/constants';
import { getFormattedDateTime } from 'Utilities/dateUtils';

import TripDetails from './TripDetails';
import UploadEwayBillModal from './UploadEwayBillModel';

const COLUMNS = [
  {
    header: {
      label: 'Item ID',
    },
    key: 'item_identifier',
    props: { md: 4, xs: 12 },
  },
  {
    header: {
      label: 'Item Name',
    },
    key: 'item_name',
    props: { md: 4, xs: 12 },
  },
  {
    header: {
      label: 'Transfer Qty',
    },
    key: 'quantity',
    props: { md: 4, xs: 12 },
  },
];

const RenderDetails = ({ data = {}, keys }) => {
  return (
    <>
      {keys?.map(
        ([
          label = '',
          key = '',
          { callback, render, dependency = false } = {},
        ]) => (
          <Grid container key={key} spacing={2}>
            <Grid item sx={12} md={4}>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                {label || ''}
              </Typography>
            </Grid>
            <Grid item sx={12} md={8}>
              {dependency ? (
                render()
              ) : (
                <Typography variant="body1">
                  :{' '}
                  {callback && data?.[key]
                    ? callback(data?.[key])
                    : data?.[key]}
                </Typography>
              )}
            </Grid>
          </Grid>
        ),
      )}
    </>
  );
};

const TransferOrderDetails = ({ loadTransferOrders = () => {}, setTab }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transferOrder, setTransferOrder] = useState(null);
  const [confirmDeleteTO, setConfirmDeleteTO] = useState(false);
  const [confirmGenerateStnForTo, setConfirmGenerateStnForTo] = useState(false);
  const [showUploadEwayBillModal, setShowUploadEwayBillModal] = useState(false);
  const [tripDetail, setTripDetail] = useState({});

  const fetchTransferOrderById = () => {
    setLoading(true);
    getTransferOrderById(params.toId, {
      for_transfer_order: true,
    })
      .then((data) => {
        setTransferOrder(data);
        setTripDetail(data.trip);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (params.toId) {
      fetchTransferOrderById();
    }
  }, [params.toId]);

  const handleEdit = () => {
    navigate('edit');
  };

  const handleDeleteTO = () => {
    setConfirmDeleteTO(!confirmDeleteTO);
  };

  const toggleShowEwayBillModel = () => {
    setShowUploadEwayBillModal(!showUploadEwayBillModal);
  };

  const deleteTO = () => {
    const { id } = transferOrder;

    return deleteTransferOrder(id).then(() => {
      notifyUser('Transfer Order deleted successfully.');

      loadTransferOrders();
      setConfirmDeleteTO(false);

      navigate('app/transfer-orders');
    });
  };

  if (loading) {
    return <AppLoader />;
  }

  if (!transferOrder && params.toId) {
    return (
      <Typography
        variant="h6"
        component="h6"
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        }}
      >
        Something went wrong
      </Typography>
    );
  }

  const stnForTo = () => {
    window.open(
      `${API.CRMUrl}nfi/shipments/${params.toId}/generate_stn_pdf.pdf`,
    );
    if (!transferOrder?.status) {
      updateShipmentStatus(params.toId).then(() => {
        loadTransferOrders();
        setConfirmGenerateStnForTo(false);
        fetchTransferOrderById();
      });
    }
  };

  return (
    <Grid item style={{ padding: '1rem' }}>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography
            variant="h6"
            color="textPrimary"
            style={{ fontWeight: 'bold', marginBottom: '1rem' }}
          >
            {transferOrder?.identifier || ''}
          </Typography>
        </Grid>
        <Grid item>
          {!transferOrder?.received_time && (
            <>
              {transferOrder?.status !== SHIPMENT_STATUS.STN_GENERATED ? (
                <>
                  <AppButton
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      setConfirmGenerateStnForTo(true);
                    }}
                  >
                    GENERATE STN
                  </AppButton>
                  <EditButton
                    isEditable={transferOrder?.is_editable}
                    size="medium"
                    handleEdit={handleEdit}
                  />
                  <DeleteButton
                    isDelete={transferOrder?.is_deletable}
                    toggleConfirmDialog={handleDeleteTO}
                    text="DELETE"
                    style={{ marginRight: '1rem' }}
                  />
                </>
              ) : (
                <>
                  <AppButton
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ marginRight: '0.5rem' }}
                    onClick={toggleShowEwayBillModel}
                  >
                    E-WAY BILL
                  </AppButton>
                  <AppButton
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ marginRight: '0.5rem' }}
                    onClick={stnForTo}
                  >
                    VIEW STN
                  </AppButton>
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
      <UploadEwayBillModal
        open={!!showUploadEwayBillModal}
        close={toggleShowEwayBillModel}
        title="Upload E-Way Bills"
        toId={params.toId}
        eway_bill_items={transferOrder?.eway_bill}
        onApiCallReloadTo={fetchTransferOrderById}
      />
      <RenderDetails
        data={transferOrder}
        keys={[
          ['Destination', 'recipient_name'],
          ['Created At', 'created_at', { callback: getFormattedDateTime }],
        ]}
      />
      <Grid container style={{ marginTop: '1rem' }}>
        <GridListView
          data={transferOrder?.non_fruit_shipment_items || []}
          columns={COLUMNS}
        />
      </Grid>
      <TripDetails
        trip={tripDetail}
        transferOrder={transferOrder}
        reloadTO={fetchTransferOrderById}
        loadTransferOrders={loadTransferOrders}
        setTab={setTab}
      />
      <ConfirmationDialog
        title="Generate STN for Transfer Order"
        open={confirmGenerateStnForTo}
        onConfirm={stnForTo}
        onCancel={() => setConfirmGenerateStnForTo(false)}
      >
        <DialogContentText>
          Are you sure you want to generate STN for this Transfer Order?
        </DialogContentText>
      </ConfirmationDialog>
      <ConfirmationDialog
        title="Delete Transfer Order"
        open={confirmDeleteTO}
        onConfirm={deleteTO}
        onCancel={() => setConfirmDeleteTO(false)}
      >
        <DialogContentText>
          Are you sure you want to delete this Transfer Order?
        </DialogContentText>
      </ConfirmationDialog>
    </Grid>
  );
};

export default TransferOrderDetails;
