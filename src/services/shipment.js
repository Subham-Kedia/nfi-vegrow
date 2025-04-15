import { supplyChainService } from 'Services/base';

/**
 * Helper method to get shipment by id
 * @param {*} id 
 * @returns 
 */
export const getShipmentById = (id, params) => {
  return supplyChainService.get(`nfi/shipments/${id}.json`, { params });
};

export const getShipments = (params) => {
  return supplyChainService.get(`nfi/shipments.json`, {
    params,
  });
};

export const getShipmentsList = (params) => {
  return supplyChainService.get(`shipments/listing.json`, {
    params,
  });
};

/**
 * Helper method to create a shipment
 * @param {*} data
 * @returns {Promise}
 */
export const createShipment = (data) => {
  return supplyChainService.post(`nfi/shipments.json`, data);
};

/**
 * Helper method to update a shipment
 * @returns {Promise}
 */
export const updateShipment = (data, id) => {
  return supplyChainService.put(`nfi/shipments/${id}.json`, data);
};

export const deleteShipment = (id) => {
  return supplyChainService.delete(`nfi/shipments/${id}.json`);
};

export const addShipmentToPO = (data, poId) => {
  return supplyChainService.put(
    `purchase_orders/${poId}/add_shipments.json`,
    data,
  );
};

export const removeShipmentFromPO = (data, poId) => {
  return supplyChainService.put(
    `purchase_orders/${poId}/remove_shipments.json`,
    data,
  );
};

export const getDispatchedShipments = (params) => {
  return supplyChainService.get(`shipments.json`, {
    params,
  });
};

/**
 * Helper service to create quality report
 * @param {*} data 
 * @returns 
 */
export const createQualityReport = (data) => {
  return supplyChainService.post(`quality_reports.json`, data);
};

/**
 * Helper service to get quality report
 * @param {*} id 
 * @returns 
 */
export const getQualityReport = (id) => {
  return supplyChainService.get(`quality_reports/${id}/get_report.json`);
};

/**
 * Helper service to update quality report
 * @param {*} data 
 * @returns 
 */
export const updateQualityReport = (data, id) => {
  return supplyChainService.put(`quality_reports/${id}/save_report.json`, data);
};

export const updateShipmentStatus = (id) =>{
   return supplyChainService.put(`nfi/shipments/${id}/updatestatus`);
};