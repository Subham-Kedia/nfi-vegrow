export const ADD_MA_TRACKER_STATES = {
  CREATE_MA: {
    label: 'Create MA',
    value: 1,
  },
  UPLOAD: {
    label: 'Upload',
    value: 2,
  },
  CONFIRMATION: {
    label: 'Confirmation',
    value: 3,
  },
};

export const EDIT_MA_TRACKER_STATES = {
  CREATE_MA: {
    label: 'Edit MA',
    value: 1,
  },
  UPLOAD: {
    label: 'Upload',
    value: 2,
  },
  CONFIRMATION: {
    label: 'Confirmation',
    value: 3,
  },
};

export const ADJUST_MA_TRACKER_STATES = {
  CREATE_MA: {
    label: 'Adjustment',
    value: 1,
  },
  UPLOAD: {
    label: 'Upload',
    value: 2,
  },
  CONFIRMATION: {
    label: 'Confirmation',
    value: 3,
  },
};

export const RETURN_MA_TRACKER_STATES = {
  CREATE_MA: {
    label: 'Record Return',
    value: 1,
  },
  UPLOAD: {
    label: 'Upload',
    value: 2,
  },
  CONFIRMATION: {
    label: 'Confirmation',
    value: 3,
  },
};

export const VENDOR_ADD_EDIT_MA_STRUCTURE = {
  vendor: null,
  source: null,
  ma_upload: null,
  material_info: [{ packaging_item: null, quantity: '', rate: '' }],
};

export const CUSTOMER_ADD_EDIT_MA_STRUCTURE = {
  customer: null,
  source: null,
  ma_upload: null,
  material_info: [{ packaging_item: null, quantity: '' }],
};

export const TRANSACTION_TYPE = {
  ADJUSTMENT: 'adjustment',
  RETURN: 'return',
  MATERIAL_ASSIGNMENT: 'material assignment',
  USAGE: 'usage',
};

export const PRINT_BASE_URL = {
  VENDOR_LEDGER: `${API.supplyChainService}nfi/material_assignments/generate_ma_acknowledgement_pdf.pdf`,
  ADD_EDIT_MA: `${API.supplyChainService}nfi/material_assignments/generate_ma_acknowledgement_pdf.pdf`,
  CUSTOMER_RETURN_FORM: `${API.supplyChainService}nfi/material_assignments_customer/generate_return_form_pdf.pdf`,
  RETURN_MA: `${API.supplyChainService}nfi/material_assignments/generate_return_acknowledgement_pdf.pdf`,
  ADJUST_MA: `${API.supplyChainService}nfi/material_assignments/generate_adjustment_acknowledgement_pdf.pdf`,
};

export const MA_TYPES = {
  CUSTOMER: 'Customer',
  VENDOR: 'Vendor',
  MANDI_FARMERS: 'Mandi Farmers',
};
