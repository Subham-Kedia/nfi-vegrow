import { supplyChainService } from 'Services/base';

class PurchaseOrderService {
  static getServiceTypes(params) {
    return supplyChainService.get('/nfi/service_types.json', {
      params,
    });
  }

  static deletePO(id) {
    return supplyChainService.delete(`/nfi/purchase_orders/${id}.json`);
  }
}

export default PurchaseOrderService;
