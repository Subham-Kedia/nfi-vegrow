export const AUDIT_TABS = {
  DRAFT: { value: 'Draft', label: 'Draft' },
  PENDING_APPROVAL: { value: 'PendingApproval', label: 'Pending Approval' },
  REJECTED: { value: 'Rejected', label: 'Rejected' },
  COMPLETED: { value: 'Completed', label: 'Completed' },
};

export const AUDIT_APPROVAL_TABS = {
  PENDING_APPROVAL: { value: 'PendingApproval', label: 'Pending Approval' },
  REJECTED: { value: 'Rejected', label: 'Rejected' },
  COMPLETED: { value: 'Completed', label: 'Approved' },
};

export const AUDIT_TYPE = {
  MONTHLY: { value: 'Monthly', text: 'Monthly' },
  SITE_CLOSURE: { value: 'Site Closure', text: 'Site Closure' },
  THIRD_PARTY: { value: 'Third Party', text: 'Third Party' },
  SITE_OPENING: { value: 'Site Opening', text: 'Site Opening' },
  EMPLOYEE_TRANSITION: {
    value: 'Employee Transition',
    text: 'Employee Transition',
  },
};

export const FIELD_NAMES = {
  ACTUAL_AVAILABLE_QTY: 'actual_available_qty',
  ACTUAL_DAMAGED_QTY: 'actual_damaged_qty',
};

export const AUDIT_STATUS = {
  DRAFT: 'Draft',
  COMPLETED: 'Completed',
  PENDING_APPROVAL: 'PendingApproval',
  REJECTED: 'Rejected',
};

export const FIELD_NAME = {
  INVENTORY_AUDIT_ITEMS: 'inventory_audit_items',
};

export const MODE = {
  VIEW: 'view',
  EDIT: 'edit',
  REVIEW: 'review',
};

export const getFilterUI = (dcs) => [
  {
    type: 'fieldSelect',
    name: 'dc_id',
    label: 'Select DC',
    options: dcs,
    style: { width: '150px', marginTop: 0 },
    size: 'small',
    showNone: false,
  },
  {
    type: 'fieldSelect',
    name: 'audit_type',
    label: 'Audit Type',
    placeholder: 'Select Audit Type',
    options: Object.values(AUDIT_TYPE),
    style: { width: '150px', marginTop: 0 },
    size: 'small',
    showNone: false,
  },
  {
    type: 'fieldDatepicker',
    name: 'after',
    label: 'Start Date',
    placeholder: 'Start Date',
    style: { width: '150px', marginTop: 0 },
    size: 'small',
  },
  {
    type: 'fieldDatepicker',
    name: 'before',
    label: 'End Date',
    placeholder: 'End Date',
    style: { width: '150px', marginTop: 0 },
    size: 'small',
  },
];
