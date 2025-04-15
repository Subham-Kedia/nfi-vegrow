import { supplyChainService } from 'Services/base';

export const getLots = (params) => {
  return supplyChainService.get(`nfi/lots.json`, { params });
};

/**
 * Helper method to get inventory based on the dc id selected
 * @param {dc_id: id} params
 * @returns {Promise}
 */
export const getInventory = (params) => {
  return supplyChainService.get('nfi/packaging_items/inventory.json', {
    params,
  });
};

/**
 * Helper method to create inventory regrading
 * @param {Object:{Object: []}}  data
 * @returns
 */
export const createRegrading = (data) => {
  return supplyChainService.post('nfi/regrade_trackers.json', data);
};

/**
 * Helper method to create inventory adjustment
 * @param {Object:{Object: []}} params
 * @returns
 */
export const getInventoryAddjustments = (params) => {
  return supplyChainService.get('nfi/inventory_adjustments.json', { params });
};

/**
 * Methods allowing to discard dump
 * @param {Object} data
 * @returns
 */
export const discardDump = (data) => {
  return supplyChainService.post(`nfi/packaging_items/dump_many.json`, data);
};

/**
 * Helper method to update inventory gaps
 * @param {packaging_items: {packaging_item: []}} data
 * @returns
 */
export const updateConsumption = (data) => {
  return supplyChainService.post(`nfi/packaging_items/consume_many.json`, data);
};

export const getPackagingItem = (params) => {
  return supplyChainService.get(`nfi/packaging_items.json`, { params });
};

export const updateLots = (data) => {
  return supplyChainService.put(`nfi/lots/update_lots.json`, data);
};

// this returns inventory of all the DCs against a nfi_packaging_item_id
export const getDCInventory = (nfi_packaging_item_id) => {
  return supplyChainService.get(
    `nfi/packaging_items/${nfi_packaging_item_id}/list_of_available_quantity_for_all_dcs`,
  );
};

export const getZeroInventory = () => {
  return supplyChainService.get('nfi/packaging_items/zero_inventory.json');
};

export const getNonZeroInventory = (params) => {
  return supplyChainService.get('nfi/packaging_items/non_zero_inventory.json', {
    params,
  });
};

export const getZeroOrNoInventory = (params) => {
  return supplyChainService.get(
    'nfi/packaging_items/zero_or_no_inventory.json',
    {
      params,
    },
  );
};
