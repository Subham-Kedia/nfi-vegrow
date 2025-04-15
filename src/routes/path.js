const PATH = {
  LOGIN: { URL: 'login', ID: 'LOGIN' },
  TRIPS_LISTING: { URL: 'trips', ID: 'TRIP_LISTING' },
  ADD_TRIPS: { URL: 'add-trips', ID: 'ADD_TRIPS' },
  EDIT_TRIPS: { URL: 'edit-trips/:id', ID: 'EDIT_TRIPS' },
  DC_ARRIVALS: { URL: 'dc-arrival', ID: 'DELIVERY' },
  PURCHASE_ORDER: { URL: 'purchase-order', ID: 'PURCHASE_ORDER' },
  INVENTORY: { URL: 'inventory', ID: 'INVENTORY' },
  INVENTORY_RECONCILIATION: {
    URL: 'inventory-reconciliation',
    ID: 'INVENTORY_RECONCILIATION',
  },
  INVENTORY_ADJUSTMENT: {
    URL: 'inventory-adjustment',
    ID: 'INVENTORY_ADJUSTMENT',
  },
  PO_APPROVALS: { URL: 'po-approvals', ID: 'PO_APPROVALS' },
  PAYMENTS: { URL: 'payments', ID: 'PAYMENTS' },
  MY_PAYMENT_REQUEST: {
    URL: 'my-payment-requests',
    ID: 'MY_PAYMENT_REQUEST',
  },
  MY_APPROVAL_LIST: {
    URL: 'my-approval-list',
    ID: 'MY_APPROVAL_LIST',
  },
  PAYMENT_REQUEST_LISTING: {
    URL: 'trip/:tripId/payment-requests/list',
    ID: 'PAYMENT_REQUEST_LISTING',
  },
  ADD_PAYMENT_REQUEST: {
    URL: 'trip/:tripId/payment-requests/create',
    ID: 'ADD_PAYMENT_REQUEST',
  },
  EDIT_PAYMENT_REQUEST: {
    URL: 'trip/:tripId/payment-requests/:prId/edit',
    ID: 'EDIT_PAYMENT_REQUEST',
  },
  ADD_BALANCE_PAYMENT_REQUEST: {
    URL: 'trip/:tripId/payment-requests/:parentId/balance/create',
    ID: 'ADD_BALANCE_PAYMENT_REQUEST',
  },
  EDIT_BALANCE_PAYMENT_REQUEST: {
    URL: 'trip/:tripId/payment-requests/:parentId/balance/:prId/edit',
    ID: 'EDIT_BALANCE_PAYMENT_REQUEST',
  },
  ADD_TRIPS_WITH_TO: {
    URL: 'transfer-order/:toId/add-trips',
    ID: 'ADD_TRIPS_WITH_TO',
  },
  TO_LISTING: {
    URL: 'transfer-orders',
    ID: 'TO_LISTING',
  },
  PAYMENT_REQUEST_LISTING_FOR_PO: {
    URL: 'purchase-order/:poId/payment-requests/list',
    ID: 'PAYMENT_REQUEST_LISTING_FOR_PO',
  },
  MATERIAL_ASSIGNMENT: {
    URL: 'material-assignment',
    ID: 'MATERIAL_ASSIGNMENT',
  },
  VENDORS: {
    URL: 'vendors',
    ID: 'VENDORS',
  },
  DC_VENDORS: {
    URL: 'dc-vendors',
    ID: 'DC_VENDORS',
  },
  DC_VENDOR_LEDGER: {
    URL: 'material-assignment/dc-vendor-ledger/:id',
    ID: 'DC_VENDOR_LEDGER',
  },
  CUSTOMERS: {
    URL: 'customers',
    ID: 'CUSTOMERS',
  },
  MA_CUSTOMER_LEDGER: {
    URL: 'material-assignment/customer-ledger/:id',
    ID: 'MA_CUSTOMER_LEDGER',
  },
  ADD_MATERIAL_ASSIGNMENT: {
    URL: 'material-assignment/create',
    ID: 'ADD_MATERIAL_ASSIGNMENT',
  },
  EDIT_MATERIAL_ASSIGNMENT: {
    URL: 'material-assignment/edit/:materialId',
    ID: 'EDIT_MATERIAL_ASSIGNMENT',
  },
  RECEIVE_MATERIAL_ASSIGNMENT: {
    URL: 'material-assignment/receive/:materialId',
    ID: 'RECEIVE_MATERIAL_ASSIGNMENT',
  },
  BOM: {
    URL: 'bom',
    ID: 'BOM',
  },
  AUDITS: {
    URL: 'audits',
    ID: 'AUDITS',
  },
  AUDIT_APPROVAL: {
    URL: 'audit-approval',
    ID: 'AUDIT_APPROVAL',
  },
  INVENTORY_AUDIT_CREATE: {
    URL: '/audits/inventory-audit',
    ID: 'INVENTORY_AUDIT_CREATE',
  },
  INVENTORY_AUDIT_VIEW: {
    URL: 'audits/view/:auditId',
    ID: 'INVENTORY_AUDIT_VIEW',
  },
  INVENTORY_AUDIT_EDIT: {
    URL: 'audits/edit/:auditId',
    ID: 'INVENTORY_AUDIT_EDIT',
  },
  INVENTORY_AUDIT_REVIEW: {
    URL: 'audits/review/:auditId',
    ID: 'INVENTORY_AUDIT_REVIEW',
  },
  ADD_MA_CUSTOMERS: {
    URL: 'material-assignment/customers/create',
    ID: 'ADD_MATERIAL_ASSIGNMENT_CUSTOMERS',
  },
  ADD_MA_VENDORS: {
    URL: 'material-assignment/dc-vendors/create',
    ID: 'ADD_MATERIAL_ASSIGNMENT_VENDORS',
  },
  EDIT_MA_VENDORS: {
    URL: 'material-assignment/dc-vendors/:maId',
    ID: 'EDIT_MATERIAL_ASSIGNMENT_VENDORS',
  },
  ADJUST_MA_VENDORS: {
    URL: 'material-assignment/dc-vendors/adjustment/:vendorId',
    ID: 'ADJUST_MATERIAL_ASSIGNMENT_VENDORS',
  },
  ADJUST_MA_CUSTOMERS: {
    URL: 'material-assignment/customers/adjustment/:customerId',
    ID: 'ADJUST_MATERIAL_ASSIGNMENT_CUSTOMERS',
  },
  RETURN_MA_VENDORS: {
    URL: 'material-assignment/dc-vendors/return/:vendorId',
    ID: 'RETURN_MATERIAL_ASSIGNMENT_VENDORS',
  },
  RETURN_MA_CUSTOMERS: {
    URL: 'material-assignment/customers/return/:customerId',
    ID: 'RETURN_MATERIAL_ASSIGNMENT_CUSTOMERS',
  },
  CLONE_MA: {
    URL: 'material-assignment/clone',
    ID: 'CLONE_MATERIAL_ASSIGNMENT',
  },
  SDN: {
    URL: 'service-delivery-note',
    ID: 'SERVICE_DELIVERY_NOTE',
  },
  PO_ADD_EDIT: {
    URL: 'purchase-order/:accessType/:id',
    ID: 'PURCHASE_ORDER_ADD_EDIT',
  },
};

export default PATH;
