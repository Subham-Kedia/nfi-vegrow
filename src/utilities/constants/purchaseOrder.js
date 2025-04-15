export const PURCHASE_ORDER_TYPE = {
  PURCHASE_ORDER: 1,
  OPEN_PURCHASE_ORDER: 2,
  SERVICE_PURCHASE_ORDER: 3,
};

export const SHIPMENT_TYPE = [
  { id: 1, name: 'Without Shipment', value: true },
  { id: 2, name: 'With Shipment', value: null },
];

export const PO_BUYING_IN_CATEGORY = {
  KGS: '1',
  UNITS: '2',
};

export const PO_TYPE = [
  { id: 0, name: 'Purchase Order', value: 1 },
  { id: 1, name: 'Open Purchase Order', value: 2 },
  { id: 2, name: 'Service Purchase Order', value: 3 },
];

export const PO_BUYING_IN_TYPES = [
  { value: PO_BUYING_IN_CATEGORY.KGS, label: 'Kgs' },
  { value: PO_BUYING_IN_CATEGORY.UNITS, label: 'Units' },
];
