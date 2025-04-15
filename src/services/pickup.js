import { supplyChainService } from 'Services/base';

export const getPickups = (params) => {
  return supplyChainService.get(`/pickups.json`, {
    params,
  });
};

export const getPickupById = (id, params) => {
  return supplyChainService.get(`/pickups/${id}.json`, {
    params,
  });
};

export const createPickup = (data) => {
  return supplyChainService.post(`pickups.json`, data);
};

export const updatePickup = (data, id) => {
  return supplyChainService.put(`nfi/pickups/${id}.json`, data);
};

export const uploadPickup = (data, id) => {
  return supplyChainService.put(`pickups/${id}/upload.json`, data);
};
