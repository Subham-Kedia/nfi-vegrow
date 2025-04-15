import RouteTransformer from 'Routes/routeTransformer';
import { toFixedNumber } from 'Utilities';

import { AUDIT_STATUS, AUDIT_TYPE, MODE } from './constants';

export const calculateDifferenceQuantity = (
  initial_quantity,
  actual_quantity,
) => {
  const differenceQuantity = initial_quantity - actual_quantity;
  const color = differenceQuantity > 0 ? 'red' : 'green';
  const formattedDifference = toFixedNumber(Math.abs(differenceQuantity), 2);
  const sign = differenceQuantity > 0 ? '-' : '+';

  return {
    color,
    formattedDifference,
    sign,
    isZero: !differenceQuantity,
  };
};

export const handleNumberChange = (event, onChange) => {
  const { value } = event.target;
  const numericValue = Number(value);

  if (numericValue >= 0) {
    onChange(event);
  }
};

export const disableDraftBtnWhenNoData = (values, rowImages) => {
  const anyImages = Object.values(rowImages).some(
    (images) => images.length > 0,
  );
  const anyFieldsFilled = values.inventory_audit_items?.some(
    ({ actual_available_qty, actual_damaged_qty }) =>
      actual_available_qty || actual_damaged_qty,
  );
  return !anyImages && !anyFieldsFilled;
};

export const isFinishAuditDisabled = (loading, values, metaInfo) => {
  if (loading) return true;
  if (values.audit_type !== AUDIT_TYPE.MONTHLY.value) return false;
  return !!metaInfo.disable_message;
};

export const hasInventoryChanged = (data, dict) => {
  const filteredData = data.filter(
    (d) => !!d.available_qty || !!d.packed_lot_qty || !!d.damaged_qty,
  );

  if (Object.keys(dict).length !== filteredData.length) return true;

  for (let i = 0; i < filteredData.length; i += 1) {
    const {
      available_qty,
      damaged_qty,
      packed_lot_qty,
      packaging_item: { id },
    } = data[i];

    const currentInventory = dict[id];

    if (
      available_qty !== currentInventory.available_qty ||
      damaged_qty !== currentInventory.damaged_qty ||
      packed_lot_qty !== currentInventory.packed_lot_qty
    ) {
      return true;
    }
  }

  return false;
};

export const getTextAndPathName = (status, auditId, isApprover) => {
  switch (true) {
    case status === AUDIT_STATUS.DRAFT ||
      (status === AUDIT_STATUS.REJECTED && !isApprover):
      return {
        text: 'Edit',
        pathname: `/app/${RouteTransformer.editInventoryAudit(auditId)}`,
      };
    case status === AUDIT_STATUS.COMPLETED ||
      (status === AUDIT_STATUS.PENDING_APPROVAL && !isApprover) ||
      (status === AUDIT_STATUS.REJECTED && isApprover):
      return {
        text: 'View',
        pathname: `/app/${RouteTransformer.viewInventoryAudit(auditId)}`,
      };
    case status === AUDIT_STATUS.PENDING_APPROVAL && isApprover:
      return {
        text: 'Review',
        pathname: `/app/${RouteTransformer.reviewInventoryAudit(auditId)}`,
      };
    default:
      return {};
  }
};

export const getMode = (pathname) => {
  switch (true) {
    case pathname.includes('review'):
      return MODE.REVIEW;
    case pathname.includes('view'):
      return MODE.VIEW;
    default:
      return MODE.EDIT;
  }
};
