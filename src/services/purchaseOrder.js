import { supplyChainService } from 'Services/base';

/**
 * Helper method to get list of POs
 * @param {*} params
 * @returns {Promise}
 */
export const getPurchaseOrders = (params, options = {}) => {
  return supplyChainService.get('nfi/purchase_orders.json', {
    params,
    ...options,
  });
};

/**
 * Helper method to PO by id
 * @param id
 * @returns {Promise}
 */
export const getPurchaseOrderById = (id, params) => {
  return supplyChainService.get(`nfi/purchase_orders/${id}.json`, {
    params,
  });
};

/**
 * Helper method to create a purchase order
 * @returns {Promise}
 */
export const createPurchaseOrder = (data) => {
  return supplyChainService.post('nfi/purchase_orders.json', data);
};

export const createPurchaseOrderWithItems = (data) => {
  return supplyChainService.post(
    'nfi/purchase_orders/create_with_purchase_items.json',
    data,
  );
};

/**
 * Helper method to update a purchase order
 * @returns {Promise}
 */
export const updatePurchaseOrder = (data, id) => {
  return supplyChainService.put(`nfi/purchase_orders/${id}.json`, data);
};

export const updatePurchaseOrderWithItems = (data, id) => {
  return supplyChainService.put(
    `nfi/purchase_orders/${id}/update_with_purchase_items.json`,
    data,
  );
};

export const deletePurchaseOrder = (id) => {
  return supplyChainService.delete(`purchase_orders/${id}.json`);
};

export const undoClosePO = (id) => {
  return supplyChainService.put(`nfi/purchase_orders/${id}/undo_close.json`);
};

export const getPurchaseOrderItems = (id) => {
  return supplyChainService.get(
    `nfi/purchase_orders/${id}/purchase_items.json`,
  );
};

/**
 * Helper method to create purchase order items for a purchase order
 * @returns {Promise}
 */
export const createPurchaseOrderItems = (data, id) => {
  return supplyChainService.post(
    `nfi/purchase_orders/${id}/purchase_items/create_many.json`,
    data,
  );
};

/**
 * Helper method to update purchase order items for a purchase order
 * @returns {Promise}
 */
export const updatePurchaseOrderItems = (data, id) => {
  return supplyChainService.put(
    `nfi/purchase_orders/${id}/purchase_items/update_many.json`,
    data,
  );
};

/**
 * Helper method to delete purchase order items for a purchase order
 * @returns {Promise}
 */
export const deletePurchaseOrderItems = (itemId, id) => {
  return supplyChainService.delete(
    `nfi/purchase_orders/${id}/purchase_items/${itemId}.json`,
  );
};

export const getBuyers = (params) => {
  return supplyChainService.get('buyers.json/', { params });
};

export const getFarmers = (params) => {
  return supplyChainService.get('farmers.json/', { params });
};

export const getPartners = (params) => {
  return supplyChainService.get('vendors.json/', { params });
};

export const getSuppliers = (params) => {
  return supplyChainService.get('suppliers.json/', { params });
};

export const getFieldExecutive = (params) => {
  return supplyChainService.get('field_executives.json/', { params });
};

export const getServiceProvider = (params) => {
  return supplyChainService.get('partners/list.json/', { params });
};

export const getProducts = (params) => {
  return supplyChainService.get('products.json/', { params });
};

export const getPaymentsById = (params) => {
  return supplyChainService.get('nfi/payments.json/', { params });
};

export const getMicroPockets = (params) => {
  return supplyChainService.get('micro_pockets.json/', { params });
};

export const approvePurchaseOrder = (id) => {
  return supplyChainService.put(`nfi/purchase_orders/${id}/approve_po`);
};

export const rejectPurchaseOrder = (id, data) => {
  return supplyChainService.put(`nfi/purchase_orders/${id}/reject_po`, data);
};

export const getPurchaseOrderConfigs = (params) => {
  return supplyChainService.get('nfi/purchase_orders/configs.json', {params});
};