export const RESOURCES = {
  PURCHASE_ORDER: 'nfi/purchase_order',
  PO_APPROVALS: 'nfi_po_approvals',
  HARVEST: 'harvest',
  TRIPS: 'nfi/trip',
  SHIPMENT: 'shipment',
  TRANSFER_ORDER: 'nfi/shipment',
  SALE_ORDER: 'sale_order',
  MATERIAL_ASSIGNMENT: 'nfi/material_assignment',
  DC_ARRIVALS: 'nfi/delivery',
  SDN: 'nfi/acknowledgment_note',
  INVENTORY_AUDIT: 'nfi/inventory_audit',
  INVENTORY_AUDIT_APPROVAL: 'nfi_inventory_audit_approvals',
  PACKAGING_BOM: 'nfi/packaging_bom'
};

export const ACTIONS = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const SENDER_TYPE = {
  PURCHASE_ORDER: 'Nfi::PurchaseOrder',
  DC: 'Dc',
};

export const SHIPMENT_STATUS = {
  STN_GENERATED: 'STN-Generated',
  SHIPMENT_GENERATED: 'Shipment-Generated',
};

export const RECIPIENT_TYPE = {
  PURCHASE_ORDER: 'PurchaseOrder',
  MATERIAL_ORDER: 'MaterialOrder',
  DC_MATERIAL_ORDER: 'DCMaterialOrder',
  DC: 'Dc',
  CUSTOMER: 'Customer',
  SALE_ORDER: 'SaleOrder',
};

export const PAYMENT_TYPES = [
  { text: 'Credit (Pay Later)', value: 'credit' },
  { text: 'Cash', value: 'cash' },
  { text: 'Cheque', value: 'Cheque' },
  { text: 'UPI/Bank Transfer', value: 'Direct Transfer' },
];

export const LOT_TYPE = {
  // Weight lot
  NON_STANDARD: 1,
  // Box lot
  STANDARD: 2,
};

export const PAYMENT_CATEGORIES = {
  FRUIT: 1,
  LABOUR: 2,
  RENT: 3,
  TRANSPORTATION: 4,
  GRADINGMACHINE: 5,
  COMMISSION: 6,
  COLDSTORAGE: 7,
  EXPERIMENT: 8,
  PACKAGING_MATERIAL: 9,
  ELECTRICITY_BILL: 12,
  VEHICLE_CANCELATION: 13,
};

export const CATEGORY_LIST = [
  { text: 'Fruit', value: PAYMENT_CATEGORIES.FRUIT },
  { text: 'Labour', value: PAYMENT_CATEGORIES.LABOUR },
  { text: 'Rent', value: PAYMENT_CATEGORIES.RENT },
  { text: 'Transportation', value: PAYMENT_CATEGORIES.TRANSPORTATION },
  {
    text: 'Vehicle Cancellation',
    value: PAYMENT_CATEGORIES.VEHICLE_CANCELATION,
  },
  { text: 'Grading Machine', value: PAYMENT_CATEGORIES.GRADINGMACHINE },
  { text: 'CA/Cold storage', value: PAYMENT_CATEGORIES.COLDSTORAGE },
  { text: 'Packaging Material', value: PAYMENT_CATEGORIES.PACKAGING_MATERIAL },
  { text: 'Electricity Bill', value: PAYMENT_CATEGORIES.ELECTRICITY_BILL },
];

export const FILTER_CATEGORY_LIST = [
  { id: 1, name: 'Fruit', value: PAYMENT_CATEGORIES.FRUIT },
  { id: 2, name: 'Labour', value: PAYMENT_CATEGORIES.LABOUR },
  { id: 3, name: 'Rent', value: PAYMENT_CATEGORIES.RENT },
  { id: 4, name: 'Transportation', value: PAYMENT_CATEGORIES.TRANSPORTATION },
  {
    id: 5,
    name: 'Vehicle Cancellation',
    value: PAYMENT_CATEGORIES.VEHICLE_CANCELATION,
  },
  { id: 6, name: 'Grading Machine', value: PAYMENT_CATEGORIES.GRADINGMACHINE },
  { id: 7, name: 'CA/Cold storage', value: PAYMENT_CATEGORIES.COLDSTORAGE },
  {
    id: 8,
    name: 'Packaging Material',
    value: PAYMENT_CATEGORIES.PACKAGING_MATERIAL,
  },
  {
    id: 9,
    name: 'Electricity Bill',
    value: PAYMENT_CATEGORIES.ELECTRICITY_BILL,
  },
];

export const SALES_ORDER_TYPE = [
  { text: 'Regular Sale', value: 'false' },
  { text: 'Liquidation Sale', value: 'true' },
];

export const SO_GRN = [
  'GRN_Partial',
  'GRN_Complete',
  'Booked',
  'Flagged_By_Finance',
];

export const MATERIAL_VARIANT = {
  DC: '1',
  PO: '2',
};

export const DISCOUNT_TYPES = {
  OTHERS: 'Others',
};

export const SO_DISPATCH_CHALLAN_STATUS = ['Alloted'];

export const DEVIATION_TYPES = {
  OTHERS: 'Others',
};

export const ROLES = {
  SALES_EXECUTIVE: 'sales_executive',
  LOGISTIC_MANAGER: 'logistics_manager',
};

export const DC = {
  DIRECT_CUSTOMER: 6,
};

export const MO_STATUS = {
  PENDING_APPROVAL: 1,
  UNAPPROVED: 2,
  APPROVED: 3,
  UNASSIGNED: 4,
  ASSIGNED_TO_SUPPLY: 5,
  ACKNOWLEDGED: 6,
  ALLOTTED: 7,
  DELIVERED: 8,
};

export const EXPERIMENTAL = [{ id: 1, name: 'Experimental', value: true }];

export const RETURN_TYPE = {
  DC: '1',
  SO: '2',
};

export const SO_SALE_UNIT = {
  KGS: 1,
  UNITS: 2,
};

export const SO_SALE_UNIT_TYPES = [
  { value: SO_SALE_UNIT.KGS, text: 'Kgs' },
  { value: SO_SALE_UNIT.UNITS, text: 'Units' },
];

export const GRN_STATUS = {
  GRN_COMPLETED: 'GRN_Complete',
  PENDING_ALLOTEMENT: 'Pending_Allotment',
  ALLOTED: 'Alloted',
};

export const TO_STATUS = {
  PENDING: 'TO BE SHIPPED',
  DISPATCHED: 'IN TRANSIT',
  RECEIVED_AT_DESTINATION: 'Received at destination',
};

export const TO_STATUS_LIST = {
  PENDING: { value: 'pending', label: TO_STATUS.PENDING },
  DISPATCHED: { value: 'dispatched', label: TO_STATUS.DISPATCHED },
  RECEIVED_AT_DESTINATION: {
    value: 'received',
    label: TO_STATUS.RECEIVED_AT_DESTINATION,
  },
};

export const PO_STATUS = {
  DRAFT: { value: 'Draft', label: 'Draft' },
  PENDING_APPROVAL: {
    value: 'Pending_Approval',
    label: 'Pending Approval',
  },
  GRN_PENDING: { value: 'GRN_Pending', label: 'GRN Pending' },
  GRN_PARTIAL: { value: 'GRN_Partial', label: 'GRN Partial' },
  GRN_CLOSED: { value: 'GRN_Closed', label: 'GRN Closed' },
  REJECTED: { value: 'Rejected', label: 'Rejected' },
};

export const PO_APPROVAL_STATUS = {
  PENDING_APPROVAL: 'Pending_Approval',
  APPROVED: ['GRN_Pending', 'GRN_Partial', 'GRN_Closed'],
  REJECTED: 'Rejected',
};

export const PO_APPROVAL_STATUS_LIST = [
  { value: PO_APPROVAL_STATUS.PENDING_APPROVAL, label: 'Pending Approval' },
  { value: PO_APPROVAL_STATUS.APPROVED, label: 'Approved' },
  { value: PO_APPROVAL_STATUS.REJECTED, label: 'Rejected' },
];

export const STATUS_LIST = {
  PENDING: { value: 'arrived', label: 'Pending' },
  RECEIVED: { value: 'completed', label: 'Received' },
};

export const GST_LIST = [
  { value: -1, text: 'Not Applicable' },
  { value: 5, text: '5%' },
  { value: 12, text: '12%' },
  { value: 18, text: '18%' },
  { value: 28, text: '28%' },
];

export const OTHER_CHARGES_LABEL = {
  transportation: 'Transportation',
  packing_charges: 'Packing Charges',
  1: 'Transportation',
  2: 'Packing Charges',
};

export const DEVICE_TYPE = {
  TABLET: 'Tablet',
  MOBILE: 'Mobile',
  DESKTOP: 'Desktop',
};

export const SO_TYPE = {
  DIRECT_CUSTOMER: 'Direct Customer',
};

export const DC_TYPE = {
  DC: 'Distribution center',
  MANDI: 'Mandi',
  COLLECTION_CENTER: 'Collection Centre',
  COLD_STORAGE: 'Cold Store',
  CA_STORE: 'CA Store',
  VIRTUAL_DC: 'Virtual DC',
  SATELLITE_CC: 'Satellite CC',
};
