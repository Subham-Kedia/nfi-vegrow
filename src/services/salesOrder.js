import { supplyChainService } from 'Services/base';

export const getSalesOrder = (params) => {
  return supplyChainService.get(`sale_orders.json`, { params });
};

export const getCentralSalesOrder = (params) => {
  return supplyChainService.get(`sale_orders/central_sale_orders.json`, {
    params,
  });
};

export const getSalesOrderById = (id, params) => {
  return supplyChainService.get(`sale_orders/${id}.json`, { params });
};

export const createSalesOrder = (data) => {
  return supplyChainService.post(`sale_orders.json`, data);
};

export const updateSalesOrderStatus = (data, id) => {
  return supplyChainService.put(`sale_orders/${id}/mark_as_void.json`, data);
};

export const updateSalesOrder = (data, id) => {
  return supplyChainService.put(
    `sale_orders/${id}/update_with_sale_order_items.json`,
    data,
  );
};

export const getSalesOrderMinDate = () => {
  return supplyChainService.get('sale_orders/get_back_date_for_so.json');
}

export const allotSalesOrder = (id, data) => {
  return supplyChainService.put(`sale_orders/${id}/allot.json`, data);
};

export const allotSalesOrderItem = (id, data) => {
  return supplyChainService.put(`sale_order_items/${id}/allot.json`, data);
};

export const unAllotSalesOrderItem = (id, data) => {
  return supplyChainService.put(`sale_order_items/${id}/unallot.json`, data);
};

export const deleteSalesOrder = (id) => {
  return supplyChainService.delete(`sale_orders/${id}.json`);
};

export const getProductIssues = (params) => {
  return supplyChainService.get(`products/1/product_issues.json`, { params });
};

export const updateSalesOrderItem = (data, id) => {
  return supplyChainService.put(`sale_order_items/${id}.json`, data);
};

export const updateSOItem = (id, data) => {
  return supplyChainService.put(`sale_order_items/${id}/update_item.json`, data);
};

export const deleteSalesOrderItem = (id) => {
  return supplyChainService.delete(`sale_order_items/${id}.json`);
};

export const updateSalesOrderItems = (id, data = {}) => {
  return supplyChainService.put(`sale_order_items/${id}/update_many.json`, data);
};

export const addSalesOrderItemReasons = (data, id) => {
  return supplyChainService.post(
    `sale_order_items/${id}/returns/create_many.json`,
    data,
  );
};

export const updateSalesOrderItemReasons = (data, id) => {
  return supplyChainService.put(
    `sale_order_items/${id}/returns/update_many.json`,
    data,
  );
};

export const getSalesOrderReturns = (id, params) => {
  return supplyChainService.get(`sale_order_items/${id}/returns.json`, {
    params,
  });
};

/**
 * Helper method to update GRN bill along with bill number
 * @param {Object<file, bill_number>} data 
 * @returns 
 */
export const uploadSaleOrderBill = (data) => {
  return supplyChainService.post('sale_order_bills.json', data);
};

/**
 * Helper method to delete a sale order bill by bill_id
 * @param {Number} id 
 * @returns 
 */
export const deleteBillById = (id) => {
  return supplyChainService.delete(`sale_order_bills/${id}.json`);
};

/**
 * Helper method to get the sale order status list
 * @returns {Array} of status list
 */
export const getSalesOrderStatus = () => {
  return supplyChainService.get(`sale_orders/status.json`);
};

/**
 * Helper method to get the sale order issues
 */
export const getSalesOrderIssues = () => {
  return supplyChainService.get(`quality_issues.json`);
};

/**
 * Helper method to upload manager's approval image
 */
export const uploadMangerApprovalImage = (id, data) => {
  return supplyChainService.put(`sale_orders/${id}.json`, data);
};
