import { supplyChainService } from 'Services/base';

export const getTargetPrice = (params) => {
  return supplyChainService.get('seller_prices/target_price.json', { params });
};