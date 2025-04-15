import { supplyChainService } from 'Services/base';

export const getHarvests = (params) => {
  return supplyChainService.get(`harvests.json`, {
    params,
  });
};

export const getHarvestById = (id) => {
  return supplyChainService.get(`harvests/${id}.json`);
};

export const createHarvest = (data) => {
  return supplyChainService.post(`harvests.json`, data);
};

export const cloneHarvest = (id, data) => {
  return supplyChainService.post(`harvests/${id}/clone.json`, data);
};

export const updateHarvest = (data, id) => {
  return supplyChainService.put(`harvests/${id}.json`, data);
};

export const updateHarvestShipment = (data, id) => {
  return supplyChainService.put(`harvests/${id}/update_shipments.json`, data);
};

export const deleteHarvest = (id) => {
  return supplyChainService.delete(`harvests/${id}.json`);
};

export const getHarvestPOItems = (id) => {
  return supplyChainService.get(`harvests/${id}/purchase_items.json`);
};

export const addGrader = (data) => {
  return supplyChainService.post(`partners/create_grader.json`, data);
};

export const updateGrader = (data, id) => {
  return supplyChainService.put(`partners/${id}/update_grader.json`, data);
};

export const getPayments = (id) => {
  return supplyChainService.get(`harvests/${id}/payments.json`);
};

export const updateAdvance = (id, data) => {
  return supplyChainService.put(`harvests/${id}/pay_advance`, data);
};
