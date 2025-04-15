import { supplyChainService } from '../../services/base/index';

class BomAPI {
  static listOfBom(params) {
    return supplyChainService.get('nfi/packaging_bom', { params });
  }

  static getBomDetail(id) {
    return supplyChainService.get(`nfi/packaging_bom/${id}`);
  }

  static addBom(data) {
    return supplyChainService.post('nfi/packaging_bom', data);
  }

  static updateBom(data) {
    return supplyChainService.put(`nfi/packaging_bom/${data.id}`, data);
  }

  static handleBOMStatus(id, status) {
    return supplyChainService.put(
      `nfi/packaging_bom/${id}/update_packaging_bom?is_disabled=${status}`,
    );
  }
}

export default BomAPI;
