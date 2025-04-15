import { supplyChainService } from 'Services/base';

export const getTrips = (params) => {
  return supplyChainService.get(`trips.json`, {
    params,
  });
};

export const getTripByid = (id) => {
  return supplyChainService.get(`trips/${id}.json`);
};

export const createTrip = (data) => {
  return supplyChainService.post(`trips.json`, data);
};

export const updateTrip = (data, id) => {
  return supplyChainService.put(`nfi/trips/${id}.json`, data);
};

export const getPickupByTripId = (tripId, params) => {
  return supplyChainService.get(`trips/${tripId}/pickups.json`, {
    params,
  });
};

export const getPickupByTripIdById = (tripId, id, params) => {
  return supplyChainService.get(`trips/${tripId}/pickups/${id}.json`, {
    params,
  });
};

export const getPickupById = (id, params) => {
  return supplyChainService.get(`pickups/${id}.json`, {
    params,
  });
};

export const createPickup = (data, tripId) => {
  return supplyChainService.post(`trips/${tripId}/pickups.json`, data);
};

export const updatePickup = (data, tripId, id) => {
  return supplyChainService.put(`trips/${tripId}/pickups/${id}.json`, data);
};

export const uploadPickup = (data, tripId, id) => {
  return supplyChainService.put(
    `trips/${tripId}/pickups/${id}/upload.json`,
    data,
  );
};

export const sendCompleteHarvestRequest = (tripId, pickupId, params) => {
  return supplyChainService.get(
    `trips/${tripId}/pickups/${pickupId}/complete.json`,
    {
      params,
    },
  );
};

export const updateConsent = (tripId, params) => {
  return supplyChainService.get(`trips/${tripId}/update_consent.json`, {
    params,
  });
};

export const endTripById = (tripId, params) => {
  return supplyChainService.put(`trips/${tripId}/finish.json`, params);
};

export const deleteTrip = (id) => {
  return supplyChainService.delete(`trips/${id}.json`);
};

export const searchTrip = (params) => {
  return supplyChainService.get(`trips`, { params });
};

export const updateDelivery = (data, id) => {
  return supplyChainService.put(
    `deliveries/${id}/update_skipping_multitenancy.json`,
    data,
  );
};

export const getTransporters = (params) => {
  return supplyChainService.get(`transporters.json`, { params });
};

export const getPurchaseOrder = (params) => {
  return supplyChainService.get(`purchase_orders/list.json`, { params });
};

export const getTripsInfo = (params) => {
  return supplyChainService.get('nfi/trips.json', { params });
};

export const endTrips = (tripId, data) => {
  return supplyChainService.put(`nfi/trips/${tripId}/finish.json`, data);
};

export const getShipmentsList = (tripId = -1) => {
  const params =
    tripId !== -1
      ? `nfi_trip=${true}&nfi_trip_id=${tripId}`
      : `nfi_trip=${true}`;
  return supplyChainService.get(`nfi/shipments.json?${params}`);
};

export const getNfiTripsById = (tripId) => {
  return supplyChainService.get(`nfi/trips/${tripId}.json`);
};

export const addNfiTrips = (data) => {
  return supplyChainService.post('nfi/trips.json', data);
};

export const editNfiTrips = (data, tripId) => {
  return supplyChainService.put(`nfi/trips/${tripId}.json`, data);
};
