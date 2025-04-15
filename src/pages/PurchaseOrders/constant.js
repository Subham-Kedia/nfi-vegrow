import { PURCHASE_ORDER_TYPE } from 'Utilities/constants/purchaseOrder';

export const purchaseOrderType = [
  { text: 'Purchase Order', value: PURCHASE_ORDER_TYPE.PURCHASE_ORDER },
  {
    text: 'Open Purchase Order',
    value: PURCHASE_ORDER_TYPE.OPEN_PURCHASE_ORDER,
  },
  {
    text: 'Service Purchase Order',
    value: PURCHASE_ORDER_TYPE.SERVICE_PURCHASE_ORDER,
  },
];

export const purchaseOrderTypeLabel = {
  [PURCHASE_ORDER_TYPE.PURCHASE_ORDER]: 'Purchase Order',
  [PURCHASE_ORDER_TYPE.OPEN_PURCHASE_ORDER]: 'Open Purchase Order',
  [PURCHASE_ORDER_TYPE.SERVICE_PURCHASE_ORDER]: 'Service Purchase Order',
};

export const PURCHASE_ITEM = {
  nfi_packaging_item: {},
  quantity: '',
  rate_uom: '',
  uom_name: '',
  market_to_system_uom: undefined,
};
