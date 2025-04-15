import { supplyChainService, nonFruitService } from 'Services/base';

export const getProducts = () => {
  return supplyChainService.get('products.json/');
};

export const getSkus = (productIds, params) => {
  if (productIds)
    return supplyChainService.get(`skus.json?product_id=${productIds.join()}`, { params });
  return supplyChainService.get('skus.json', { params });
};

export const getReasons = (productId, params) => {
  return supplyChainService.get(`products/${productId}/product_issues.json`, {
    params,
  });
};

export const getPackagingType = () => {
  return supplyChainService.get('products/packaging_types.json/');
};

export const getDiscountTypes = () => {
  return supplyChainService.get('discount_types.json/');
};

export const getDeviationTypes = () => {
  return supplyChainService.get('deviation_types.json/');
};

export const getCategoryProducts = () => {
  return supplyChainService.get('products/categories.json/');
};