import { nonFruitService, supplyChainService } from 'Services/base';

export const getPackagingBoms = (params) => {
  return nonFruitService.get('packaging_boms.json/', { params });
};

export const getPackagingBomById = (id) => {
  return nonFruitService.get(`packaging_boms/${id}.json/`);
};

export const createPackagingBom = (data) => {
  return nonFruitService.post('packaging_boms.json/', data);
};

export const updatePackagingBom = (data, id) => {
  return nonFruitService.put(`packaging_boms/${id}.json/`, data);
};

export const disablePackagingBom = (id) => {
  return nonFruitService.put(`packaging_boms/${id}/disable.json`);
};

export const getFruitCategories = (query) => {
  return supplyChainService.get(`product_categories?q=${query}`);
};
