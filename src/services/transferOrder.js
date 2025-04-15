import { supplyChainService } from 'Services/base';

export const getTransferOrders = (params) => {
  return supplyChainService.get(`nfi/shipments/transfer_orders.json`, { params });
};

export const getAvailableInventory = (params) => {
  return supplyChainService.get(`nfi/packaging_items/available_inventory.json`, { params });
};

export const getTransferOrderById = (id, params) => {
  return supplyChainService.get(`nfi/shipments/${id}.json`, { params });
};

export const updateTransferOrder = (data, id) => {
  return supplyChainService.put(
    `nfi/shipments/${id}/update_transfer_order.json`,
    data,
  );
};

export const addTransferOrder = (data) => {
  return supplyChainService.post(`nfi/shipments/create_transfer_order.json`, data);
};

export const deleteTransferOrder = (id) => {
  return supplyChainService.delete(`nfi/shipments/${id}/delete_transfer_order.json`)
};

export const uploadEwayBills = (data, id) => {
  return supplyChainService.post(`nfi/shipments/${id}/eway_bills`, data);
};

export const deleteEwayBill = (id) => {
  return supplyChainService.delete(`nfi/eway_bills/${id}/delete_bill`);
};
