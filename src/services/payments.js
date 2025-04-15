import { supplyChainService } from 'Services/base';

/**
 * Helper method to get list of purchase order approvers
 * @param {*} params
 * @returns
 */
export const getPOApprovers = (params) => {
  return supplyChainService.get('buyer_approvers.json/', { params });
};

/**
 * Helper method to get list of approvers related to a Trip
 * @param {*} params
 * @returns
 */
export const getTripApprovers = (params) => {
  return supplyChainService.get('logistic_approvers.json/', { params });
};

/**
 * Helper method to get list of DC approvers
 * @param {*} params
 * @returns
 */
export const getDCApprovers = (params) => {
  return supplyChainService.get('nfi/buyer_approvers.json', { params });
};

/**
 * Helper method to get list of DC vendors
 * @param {*} params
 * @returns
 */
export const getDCVendors = (params) => {
  return supplyChainService.get('dc_vendors.json', { params });
};

/**
 * Helper method to get list of payment request related to trip/po
 * @param {*} params
 * @returns
 */
export const getPaymentListing = (params) => {
  return supplyChainService.get(`nfi/payment_requests.json`, { params });
};

export const getCostHeads = (params) => {
  return supplyChainService.get('cost_heads.json', { params });
};

/**
 * Helper method to get list of payment request related to vendor remaining amount
 * @param {*} params
 * @returns
 */
export const getVendorAdjustmentListing = (params) => {
  return supplyChainService.get(
    `payment_requests/get_vendor_ajustment_payment_requests.json`,
    { params },
  );
};

/**
 * Helper method to get payment request detail by id
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const getPaymentRequestById = (id, params) => {
  return supplyChainService.get(`nfi/payment_requests/${id}.json`, { params });
};

/**
 * Helper to create a new payment request
 * @param {*} params
 * @returns
 */
export const createPaymentRequest = (data) => {
  let url = `nfi/payment_requests.json`;
  if (data.payment_request.nfi_trip_id) {
    url = `nfi/payment_requests.json?nfi_trip=${true}`;
  }
  return supplyChainService.post(url, data);
};

/**
 * Helper to update a payment request by id
 * @param {*} params
 * @param {*} id
 * @returns
 */
export const updatePaymentRequest = (data, id) => {
  let url = `nfi/payment_requests/${id}.json`;
  if (data.payment_request.nfi_trip_id || data.payment_request.parent_bill_id) {
    url = `nfi/payment_requests/${id}.json?nfi_trip=${true}`;
  }
  return supplyChainService.put(url, data);
};

/**
 * Helper to approve or reject a payment request
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const approveOrRejectPayment = (id, params) => {
  return supplyChainService.put(`nfi/payment_requests/${id}.json`, params);
};

/**
 * Helper to delete a payment request
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const deletePaymentRequestById = (id, params) => {
  return supplyChainService.delete(`nfi/payment_requests/${id}.json`, {
    params,
  });
};

/**
 * Helper to get a vendor details related to a payment request
 * @param {*} params
 * @returns
 */
export const getPaymentRequestVendors = (params) => {
  return supplyChainService.get(`nfi/partners/pr_vendors.json`, { params });
};

/**
 * Helper to get trip details of a payment request
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const getTripPRDetails = (id, params) => {
  return supplyChainService.get(`nfi/trips/${id}/payment_request.json`, params);
};

/**
 * Helper to upload delivery challan
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const uploadDeliveryChallan = (id, data, params) => {
  return supplyChainService.put(`deliveries/${id}/upload.json`, data, {
    ...params,
  });
};

export const getVendorAdvanceAdjustmentListing = (params) => {
  return supplyChainService.get(
    `nfi/payment_requests/adjustments_from_previous_advances.json`,
    { params },
  );
};
