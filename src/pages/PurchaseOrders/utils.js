import { toFixedNumber } from 'Utilities';
import { PO_STATUS, SHIPMENT_STATUS } from 'Utilities/constants';
import { PAYMENT_REQUEST_TYPE } from 'Utilities/constants/paymentRequest';
import { PURCHASE_ORDER_TYPE } from 'Utilities/constants/purchaseOrder';

import { UOM_TYPE } from './PurchaseOrderAddEdit/const';

export const getOtherChargesData = (selectedShipmentId, shipments = []) => {
  return shipments.find(({ id }) => id === selectedShipmentId)
    ?.other_bill_charges_metadata;
};

export const createPurchaseItemsHash = (purchaseItems) => {
  return purchaseItems.reduce((hash, item) => {
    const {
      id,
      packaging_item: { id: packagingItemId },
    } = item;
    return { ...hash, [packagingItemId]: id };
  }, {});
};

export const findPurchaseItemId = (
  index,
  nonFruitShipmentItems,
  selectedShipment,
  purchaseItems,
  purchaseItemsHash,
) => {
  const purchaseItemId = selectedShipment
    ? purchaseItemsHash[nonFruitShipmentItems[index].nfi_packaging_item_id] ||
      ''
    : purchaseItems[index]?.id || '';
  return purchaseItemId;
};

export const isPOTypePurchaseOrder = (value) => {
  const { PURCHASE_ORDER, SERVICE_PURCHASE_ORDER } = PURCHASE_ORDER_TYPE;

  return [PURCHASE_ORDER, SERVICE_PURCHASE_ORDER].includes(
    value.purchase_order_type,
  );
};

export const isPOTypeSelected = (value) => value.purchase_order_type !== null;

export const getFieldName = (value) => {
  if (value.purchase_order_type === PURCHASE_ORDER_TYPE.PURCHASE_ORDER) {
    return {
      name: 'expected_delivery_date',
      label: 'Expected Delivery Date',
      placeholder: 'Expected Delivery Date',
    };
  }

  return {
    name: 'expected_completion_date',
    label: 'Expected Completion Date',
    placeholder: 'Expected Delivery Date',
  };
};

export const getPurchaseItemsData = (
  nfiPackagingItem,
  serviceType,
  poType,
  uomName,
  description,
) => {
  if (poType === PURCHASE_ORDER_TYPE.SERVICE_PURCHASE_ORDER) {
    return {
      purchase_entity_id: serviceType.id,
      purchase_entity_type: 'Nfi::ServiceType',
      uom_type: UOM_TYPE.SYSTEM,
      uom_name: serviceType.unit_of_measurement,
      description,
    };
  }

  return {
    purchase_entity_id: nfiPackagingItem.id,
    purchase_entity_type: 'Nfi::PackagingItem',
    uom_type: nfiPackagingItem.uom_dropdown.find(
      ({ value }) => value === uomName,
    ).uom_type,
    uom_name: uomName,
  };
};

export const isShipmentAdditionAllowed = (status, po_type) => {
  const { SERVICE_PURCHASE_ORDER, PURCHASE_ORDER } = PURCHASE_ORDER_TYPE;

  if ([SERVICE_PURCHASE_ORDER, PURCHASE_ORDER].includes(po_type)) {
    return false;
  }

  if (status === PO_STATUS.GRN_CLOSED.value) return false;

  return true;
};

export const disableDeleteForShipmentModal = (shipment) => {
  const { received_time, status, po_type } = shipment || {};
  const { OPEN_PURCHASE_ORDER, PURCHASE_ORDER } = PURCHASE_ORDER_TYPE;
  return (
    received_time ||
    (status === SHIPMENT_STATUS.SHIPMENT_GENERATED &&
      po_type === OPEN_PURCHASE_ORDER) ||
    po_type === PURCHASE_ORDER
  );
};

export const checkShipmentCondition = (selectedShipment, isPOClosed) => {
  const { received_time, status, po_type } = selectedShipment || {};
  return (
    received_time ||
    isPOClosed ||
    status === SHIPMENT_STATUS.SHIPMENT_GENERATED ||
    po_type === PURCHASE_ORDER_TYPE.PURCHASE_ORDER
  );
};

export const calculatePurchaseValues = (purchaseItems) => {
  const calculateTotalTaxableAmount = () => {
    return toFixedNumber(
      purchaseItems.reduce((acc, { agreed_value }) => {
        acc += agreed_value;
        return acc;
      }, 0),
      2,
    );
  };

  const calculateTotalGST = () => {
    return toFixedNumber(
      purchaseItems.reduce((acc, { agreed_value, gst = 0 }) => {
        acc += (agreed_value * (gst >= 0 ? gst : 0)) / 100;
        return acc;
      }, 0),
      2,
    );
  };

  const totalTaxableAmt = calculateTotalTaxableAmount();
  const totalGST = calculateTotalGST();
  const totalPayment = totalTaxableAmt + totalGST;

  return {
    totalTaxableAmt,
    totalGST,
    totalPayment,
  };
};

export const calculateRemainingPayment = (totalValue) => {
  return (values) => {
    const advanceAmount = (values.advance_amount_adjustments || []).reduce(
      (acc, val) => acc + val.amount,
      0,
    );

    const vendorAdvanceAmount = (
      values.vendor_advance_adjustments || []
    ).reduce((acc, val) => acc + val.amount, 0);

    return toFixedNumber(totalValue - advanceAmount - vendorAdvanceAmount, 2);
  };
};

export const prAttachment = (isServicePO, prId, values, purchaseOrder) => {
  if (values.payment_request_bill?.[0])
    return {
      file: values.payment_request_bill?.[0],
      url: values.payment_request_bill?.[0].url,
    };

  if (prId) {
    return { url: values.bill };
  }

  const isBillPR = values.payment_request_type === PAYMENT_REQUEST_TYPE.BILL;

  if (isServicePO && isBillPR) {
    return {
      url: purchaseOrder.acknowledgement_note.bill.url,
    };
  }

  return {};
};

export const shouldDisableBillPR = (
  prId,
  isServicePO,
  acknowledgement_note,
) => {
  if (prId) return true;

  if (isServicePO) {
    return !acknowledgement_note.acknowledgment_docs.length;
  }

  return false;
};

export const getPODate = (nfiPoMaxDays) => {
  const maxDate = new Date();
  const minDate = new Date();

  if (nfiPoMaxDays !== null) {
    minDate.setDate(maxDate.getDate() - nfiPoMaxDays + 1);
  }

  return {
    poMaxDate: maxDate,
    poMinDate: minDate,
  };
};

// in Read Only mode id will definitely be there
// hence not checking for both isReadOnly and id when isReadOnly is true
export const getPOAddEditPageTitle = (isReadOnly, id) => {
  if (isReadOnly) return `Purchase Order - ${id}`;

  if (id) return `Edit Purchase Order - ${id}`;

  return 'Add Purchase Order';
};

export const isPendingApproval = (status) =>
  status === PO_STATUS.PENDING_APPROVAL.value;

export const isRejected = (status) => status === PO_STATUS.REJECTED.value;

export const isGrnClosed = (status) => status === PO_STATUS.GRN_CLOSED.value;

export const isDraft = (status) => status === PO_STATUS.DRAFT.value;

export const getCostHeadId = (isServicePo, costHeadsList, selectedCostHead) => {
  if (!isServicePo) return costHeadsList.find((ch) => ch.name === 'NonFruit').id
  return selectedCostHead.id
};
