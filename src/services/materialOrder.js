import { supplyChainService } from 'Services/base';

export const getMaterialOrderList = (params) => {
  return supplyChainService.get(`material_orders/list.json`, { params });
};

export const createChildMo = (data) => {
  return supplyChainService.post(`material_orders/create_child.json`, data);
};

export const deleteMo = (id) => {
  return supplyChainService.delete(`material_orders/${id}.json`);
};

export const approveMoById = (data, id) => {
  return supplyChainService.put(`material_orders/${id}.json`, data);
};

export const updateChildMo = (data, id) => {
  return supplyChainService.put(`material_orders/${id}/update_child.json`, data);
};

export const updateAMOItems = (data) => {
  return supplyChainService.put('material_order_items/update_many.json', data);
}

/**
 * Method to get Material order list
 * @param {*} params 
 * @returns 
 */
export const getMaterialOrder = (params) => {
  return supplyChainService.get(`material_orders.json`, {
    params,
  });
};

/**
 * Method to allot material order items for material order
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const allotMaterialOrder = (id, data) => {
  return supplyChainService.put(`material_order_items/${id}/allot.json`, data);
};