import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DialogContentText from '@mui/material/DialogContentText';
import {
  AppButton,
  AppLoader,
  ConfirmationDialog,
  DeleteButton,
  GridListView,
} from 'Components';
import { FieldCombo, FieldDatePicker } from 'Components/FormFields';
import CustomModal from 'Components/Modal';
import { Formik } from 'formik';
import {
  createShipment,
  deleteShipment,
  getShipmentById,
  updateShipment,
  updateShipmentStatus,
} from 'Services/shipment';
import { getBillToLocations, getDcs } from 'Services/users';
import { notifyUser } from 'Utilities';
import { SENDER_TYPE, SHIPMENT_STATUS } from 'Utilities/constants';
import { PURCHASE_ORDER_TYPE } from 'Utilities/constants/purchaseOrder';
import { validateRequired } from 'Utilities/formvalidation';

import {
  checkShipmentCondition,
  createPurchaseItemsHash,
  disableDeleteForShipmentModal,
  findPurchaseItemId,
} from '../utils';

import { SHIPMENT_COLUMNS } from './columns';

const ShipmentAddEditModal = ({
  selectedShipment: {
    shipmentData = {},
    shipmentId = null,
    open = false,
    isPOClosed = false,
  } = {},
  onClose = () => {},
  loadPurchaseOrders = () => {},
}) => {
  const [dcs, setDcs] = useState([]);
  const [billToLocations, setBillToLocations] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isDeleting, setDeletingStatus] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [confirmDeleteShipment, setConfirmDeleteShipment] = useState(false);
  const [confirmGenerateShipment, setConfirmGenerateShipment] = useState(false);

  const fetchShipmentData = (selectedShipmentId) => {
    setLoading(true);
    getShipmentById(selectedShipmentId || '')
      .then((data) => {
        setSelectedShipment({
          ...data,
          non_fruit_shipment_items: data?.non_fruit_shipment_items?.reduce(
            (acc, { packaging_item_id = '', ...rest }) => {
              const packaging_item = shipmentData?.purchase_items?.find(
                ({ packaging_item: { id = '' } = {} }) =>
                  id === packaging_item_id,
              );
              return [...acc, { ...rest, packaging_item }];
            },
            [],
          ),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!dcs.length) {
      getDcs().then(({ items = [] }) => {
        const dcItem = items?.reduce((acc, dc) => {
          acc.push({
            ...dc,
            id: `dc-${dc.id}`,
            dc_id: dc?.id || '',
            type: 'DC',
          });
          return acc;
        }, []);
        setDcs(dcItem);
      });
    }

    if (!billToLocations.length) {
      getBillToLocations().then((res) => {
        if (res?.items) {
          setBillToLocations(res.items);
        }
      });
    }

    if (shipmentId) {
      fetchShipmentData(shipmentId);
    }
  }, [shipmentId]);

  const onModalClose = () => {
    setSelectedShipment(null);
    onClose();
  };

  const handleDeleteShipment = () => {
    setConfirmDeleteShipment(!confirmDeleteShipment);
  };

  const deletePOShipment = () => {
    setDeletingStatus(true);

    deleteShipment(shipmentId)
      .then(() => {
        setSelectedShipment(null);
        loadPurchaseOrders();
        onClose();
        notifyUser('Shipment deleted successfully');
      })
      .finally(() => {
        setDeletingStatus(false);
      });
  };

  const addUpdateShipment = (values, { setSubmitting = () => {} }) => {
    const {
      non_fruit_shipment_items = {},
      delivery_location: { dc_id: dcId = '' } = {},
      expected_delivery_date = {},
      billto_location: { id: billto_location_id = '' } = {},
    } = values;

    const { purchase_items: purchaseItems } = shipmentData;
    const purchaseItemsHash = selectedShipment
      ? createPurchaseItemsHash(purchaseItems || [])
      : {};

    const createItems = non_fruit_shipment_items.reduce(
      (acc, { id = '', quantity = 0 }, index = 0) => {
        if (!quantity) return acc;
        return [
          ...acc,
          {
            quantity,
            non_fruit_purchase_item_id: findPurchaseItemId(
              index,
              non_fruit_shipment_items,
              selectedShipment,
              purchaseItems || [],
              purchaseItemsHash,
            ),
            ...(selectedShipment ? { id: id || '' } : {}),
          },
        ];
      },
      [],
    );

    if (!createItems?.length) {
      return notifyUser('At least one item should have valid value', 'error');
    }

    const processShipment = selectedShipment ? updateShipment : createShipment;

    processShipment(
      {
        non_fruit_shipment: {
          non_fruit_shipment_items: createItems,
          recipient_type: 'Dc',
          instructions: '',
          recipient_id: dcId,
          sender_id: shipmentData?.id || '',
          sender_type: SENDER_TYPE.PURCHASE_ORDER,
          expected_delivery_date,
          billto_location_id,
        },
      },
      selectedShipment?.id,
    )
      .then(() => {
        setSelectedShipment(null);
        loadPurchaseOrders();
        onClose();
        notifyUser(
          `Shipment ${
            selectedShipment?.id ? 'updated' : 'created'
          } successfully`,
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const generateShipmentOrder = () => {
    if (selectedShipment?.status === null) {
      updateShipmentStatus(selectedShipment?.id).then(() => {
        setConfirmGenerateShipment(false);
        fetchShipmentData(selectedShipment?.id);
      });
    }
    window.open(
      `${API.CRMUrl}nfi/shipments/${selectedShipment?.id}/generate_shipment_order.pdf`,
    );
  };

  if (isLoading) {
    return <AppLoader />;
  }

  const getFilteredPurchaseItems = () => {
    if (!shipmentId) {
      return shipmentData?.purchase_items || [];
    }
    const selectedShipmentIndex = shipmentData?.non_fruit_shipments?.findIndex(
      (shipment) => shipment.id === selectedShipment?.id,
    );
    const shipmentItems =
      shipmentData?.non_fruit_shipments?.[selectedShipmentIndex]
        ?.non_fruit_shipment_items || [];
    const shipmentItemsIds = shipmentItems?.map(
      ({ packaging_item_id = '' }) => packaging_item_id,
    );
    return (
      shipmentData?.purchase_items.filter(({ packaging_item: { id = '' } }) =>
        shipmentItemsIds.includes(id),
      ) || []
    );
  };

  const hasChangeInInitialQuantity = (values) => {
    return selectedShipment?.non_fruit_shipment_items?.some(
      (item, index) =>
        item.quantity !== values.non_fruit_shipment_items?.[index]?.quantity,
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        non_fruit_shipment_items:
          selectedShipment?.non_fruit_shipment_items || [],
        delivery_location:
          dcs?.find((dc) => dc?.dc_id === selectedShipment?.recipient_id) ||
          null,
        expected_delivery_date:
          selectedShipment?.expected_delivery_date || null,
        billto_location:
          billToLocations?.find(
            (billToLocation) =>
              billToLocation?.id === selectedShipment?.billto_location_id,
          ) || null,
      }}
      onSubmit={addUpdateShipment}
    >
      {({ handleSubmit, isSubmitting, values }) => (
        <CustomModal
          fullScreen
          title={
            selectedShipment
              ? `Edit Shipment: ${selectedShipment?.identifier || ''}`
              : `Add Shipment: PO - ${shipmentData?.id || ''}`
          }
          open={open}
          onClose={onModalClose}
          footerComponent={
            <>
              {shipmentId && (
                <>
                  {selectedShipment?.po_type ===
                    PURCHASE_ORDER_TYPE.OPEN_PURCHASE_ORDER && (
                    <>
                      {selectedShipment?.status !==
                      SHIPMENT_STATUS.SHIPMENT_GENERATED ? (
                        <AppButton
                          variant="contained"
                          size="small"
                          color="primary"
                          style={{ marginRight: '1rem' }}
                          disabled={hasChangeInInitialQuantity(values)}
                          onClick={() => {
                            setConfirmGenerateShipment(true);
                          }}
                        >
                          GENERATE SHIPMENT ORDER
                        </AppButton>
                      ) : (
                        <AppButton
                          variant="contained"
                          size="small"
                          color="primary"
                          style={{ marginRight: '1rem' }}
                          onClick={generateShipmentOrder}
                        >
                          VIEW SHIPMENT ORDER
                        </AppButton>
                      )}
                    </>
                  )}
                  <DeleteButton
                    isDelete={selectedShipment?.is_deletable}
                    toggleConfirmDialog={handleDeleteShipment}
                    loading={isDeleting}
                    text="DELETE"
                    disabled={disableDeleteForShipmentModal(selectedShipment)}
                    style={{ marginRight: '1rem' }}
                  />
                </>
              )}
              <AppButton
                startIcon={<SaveIcon />}
                variant="contained"
                size="small"
                color="primary"
                loading={isSubmitting || isDeleting}
                type="submit"
                disabled={checkShipmentCondition(selectedShipment, isPOClosed)}
                onClick={handleSubmit}
              >
                Save
              </AppButton>
            </>
          }
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <FieldCombo
              name="delivery_location"
              label="Delivery Location"
              placeholder="Select Delivery Location"
              variant="outlined"
              options={dcs}
              style={{
                marginBottom: '2rem',
                width: 300,
              }}
              id="delivery_location"
              required
              validate={validateRequired}
              disabled={checkShipmentCondition(selectedShipment, isPOClosed)}
            />
            <FieldDatePicker
              name="expected_delivery_date"
              label="Expected Delivery Date"
              placeholder="Expected Delivery Date"
              variant="inline"
              autoOk
              disabled={checkShipmentCondition(selectedShipment, isPOClosed)}
              inputVariant="outlined"
              format="DD/MM/YYYY"
              style={{
                marginBottom: '2rem',
                width: 300,
              }}
              required
              validate={validateRequired}
              InputLabelProps={{
                required: true,
                shrink: true,
              }}
              textFieldProps={{ size: 'small' }}
            />
            <FieldCombo
              name="billto_location"
              label="Bill-to Location"
              placeholder="Select Bill-to Location"
              variant="outlined"
              options={billToLocations}
              style={{
                marginBottom: '2rem',
                width: 300,
              }}
              id="bill_to_location"
              required
              validate={validateRequired}
              disabled={checkShipmentCondition(selectedShipment, isPOClosed)}
            />
          </div>
          <GridListView
            isHeaderSticky
            data={getFilteredPurchaseItems()}
            columns={SHIPMENT_COLUMNS}
            cellProps={{ selectedShipment, isPOClosed }}
          />
          <ConfirmationDialog
            title={`Shipment ${selectedShipment?.id} `}
            open={confirmGenerateShipment}
            onConfirm={generateShipmentOrder}
            onCancel={() => setConfirmGenerateShipment(false)}
          >
            <DialogContentText>
              Are you sure ? You won't be able to edit the shipment once the
              shipemnt order is generated.
            </DialogContentText>
          </ConfirmationDialog>
          <ConfirmationDialog
            title="Delete Shipment"
            open={confirmDeleteShipment}
            onConfirm={deletePOShipment}
            onCancel={() => setConfirmDeleteShipment(false)}
          >
            <DialogContentText>
              Are you sure you want to delete this Shipment?
            </DialogContentText>
          </ConfirmationDialog>
        </CustomModal>
      )}
    </Formik>
  );
};

export default ShipmentAddEditModal;
