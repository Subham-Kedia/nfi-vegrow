import { supplyChainService } from 'Services/base';

class AuditAPI {
  static getAllAudits = (params) => {
    return supplyChainService.get('nfi/inventory_audits.json', { params });
  };

  static getAllApproverAudits = (params) => {
    return supplyChainService.get('nfi/inventory_audit_approvals.json', {
      params,
    });
  };

  static createInventoryAudit = (data, params) => {
    return supplyChainService.post(
      'nfi/inventory_audits/create_with_inventory_audit_items.json',
      data,
      { params },
    );
  };

  static viewInventoryAudit = (id, params) => {
    return supplyChainService.get(`nfi/inventory_audits/${id}.json`, {
      params,
    });
  };

  static updateAudit = (id, data, params) => {
    return supplyChainService.put(
      `nfi/inventory_audits/${id}/update_with_inventory_audit_items.json`,
      data,
      { params },
    );
  };

  static discardAudit = (id) => {
    return supplyChainService.delete(`nfi/inventory_audits/${id}.json`);
  };

  static getAuditMetaInfo = () => {
    return supplyChainService.get(
      '/nfi/inventory_audits/meta_info_for_audit_completion.json?audit_type=Monthly',
    );
  };

  static rejectInventoryAudit(id, data) {
    return supplyChainService.put(
      `nfi/inventory_audit_approvals/${id}/reject_inventory_audit.json`,
      data,
    );
  }

  static approveInventoryAudit(id, data) {
    return supplyChainService.put(
      `nfi/inventory_audit_approvals/${id}/approve_inventory_audit.json`,
      data,
    );
  }
}

export default AuditAPI;
