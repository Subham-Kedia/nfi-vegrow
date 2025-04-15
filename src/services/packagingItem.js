import { nonFruitService, supplyChainService } from 'Services/base';

export const getPackagingItems = (params) => {
  return nonFruitService.get('packaging_items.json/', { params });
};

export const getDcMandiPackagingItems = () => {
  return supplyChainService.get(
    'nfi/packaging_items/mandi_packaging_items.json',
  );
};
