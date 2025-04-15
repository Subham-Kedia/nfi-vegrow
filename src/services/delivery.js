import { supplyChainService } from 'Services/base';

/**
 * Helper method to get list of deliveries
 * @param {*} params
 * @returns {Promise}
 */
export const getDeliveries = (params) => {
  return supplyChainService.get(`nfi/deliveries.json`, { params });
};

export const getDeliveriesDcArrival = (params) => {
  return supplyChainService.get(`nfi/deliveries.json`, { params });
};

/**
 * Helper method to update deliveries
 * @param {Object} data
 * @param {Number} id
 * @returns {Promise}
 */
export const updateReceivedQuantity = (data, id) => {
  return supplyChainService.put(
    `nfi/shipments/${id}/record_dc_arrivals.json`,
    data,
  );
};

export const updateDelivery = (data, id) => {
  return supplyChainService.put(`nfi/deliveries/${id}.json`, data);
};

/**
 * Helper method to get list of lots based on params
 * @param {Object > dc} params
 * @returns {Promise}
 */
export const getLots = (params) => {
  return supplyChainService.get(`nfi/lots.json`, { params });
};
