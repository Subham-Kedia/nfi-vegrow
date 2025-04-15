import { supplyChainService } from 'Services/base';

export const getDeliveries = (params) => {
  return supplyChainService.get(`deliveries.json`, { params });
};

export const getDeliveryById = (id, params) => {
  return supplyChainService.get(`deliveries/${id}.json`, { params });
};

export const updateDeliveryById = (id, data) => {
  return supplyChainService.put(`deliveries/${id}.json`, data);
};

export const uploadDeliveryById = (id, data) => {
  return supplyChainService.put(`deliveries/${id}/upload.json`, data);
};

export const getSamplings = (params) => {
  return supplyChainService.get(`samplings.json`, { params });
};

export const addSamplings = (data) => {
  return supplyChainService.post(`samplings.json`, data);
};

export const updateSamplings = (data, id) => {
  return supplyChainService.put(`samplings/${id}.json`, data);
};

export const generateDCLots = (deliveryId, data) => {
  return supplyChainService.put(
    `dc_lots/unloading.json?delivery_id=${deliveryId}`,
    data,
  );
};

export const getDeliveryDCLots = (params) => {
  return supplyChainService.get(`lots.json`, {
    params: { ...params, dc: true },
  });
};

export const getSamplingDCLots = (params) => {
  return supplyChainService.get(`samplings.json`, { params });
};

export const updateDCLots = (data, id) => {
  return supplyChainService.put(`lots/${id}.json`, data);
};
