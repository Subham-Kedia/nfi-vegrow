export const STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  PAID: 4,
  IN_PROCESS: 5,
  FINANCE_APPROVED: 8,
};

export const PAYMENT_REQUEST_TYPE = {
  ADVANCE: 1,
  BILL: 2,
};

export const STATUS_LIST = [
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Business Approved' },
  { value: 8, label: 'Finance Approved' },
  { value: 9, label: 'Ready To Pay' },
  { value: 3, label: 'Rejected' },
  { value: 5, label: 'In Process' },
  { value: 4, label: 'Paid' },
];

export const PAYMENT_REQUEST_FILTERS = [
  { id: 0, name: 'Not Raised', value: 0 },
  { id: 1, name: 'Advance Payement', value: 1 },
  { id: 2, name: 'Bill', value: 2 },
];

export const PAYMENT_REQUEST_PRIORITY = {
  HIGH: 1,
  LOW: 3,
};
