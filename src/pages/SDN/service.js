import { supplyChainService } from 'Services/base';

class SDNService {
  static getSDNData(params) {
    return supplyChainService.get('/nfi/acknowledgment_notes.json', {
      params,
    });
  }

  static updateSDNAck(id, data) {
    return supplyChainService.put(`/nfi/acknowledgment_notes/${id}.json`, data);
  }
}

export default SDNService;
