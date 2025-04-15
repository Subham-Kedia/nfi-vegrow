import { supplyChainService } from './base';

class MaterialAssignmentAPI {
  static createMaterialAssignment(data) {
    return supplyChainService.post('nfi/material_assignments.json', data);
  }

  static getMaterialAssignmentById(id) {
    return supplyChainService.get(`nfi/material_assignments/${id}.json`);
  }

  static updateMaterialAssignment(id, data) {
    return supplyChainService.put(`nfi/material_assignments/${id}.json`, data);
  }

  static recieveMaterialById(data) {
    return supplyChainService.post(`nfi/receivings.json`, data);
  }

  static deleteMaterialAssignmentById(id) {
    return supplyChainService.delete(`/nfi/material_assignments/${id}.json`);
  }

  static getMaterialAssignmentItems(params) {
    return supplyChainService.get(`/nfi/material_assignments.json`, { params });
  }

  static uploadAcknowledgement(id, data) {
    return supplyChainService.put(
      `/nfi/material_assignments/${id}/acknowledge.json`,
      data,
    );
  }

  static getSummary() {
    return supplyChainService.get(
      `/nfi/packaging_items/pending_dc_summary.json`,
    );
  }

  static closeMaterialAssignmentById(id, gap_acknowledgement) {
    return supplyChainService.put(
      `/nfi/material_assignments/${id}/close_material_assignment.json`,
      {
        material_assignment: {
          gap_acknowledgement,
        },
      },
    );
  }

  static getMaVendorListing(params) {
    return supplyChainService.get(`nfi/material_assignments_vendor.json`, {
      params,
    });
  }

  static getMaVendorLedger(params) {
    return supplyChainService.get(
      `nfi/material_assignments_vendor/get_transactions`,
      { params },
    );
  }

  static getMaCustomerLedger(params) {
    return supplyChainService.get(
      `nfi/material_assignments_customer/get_transactions`,
      { params },
    );
  }

  static createDcVendorMA(data) {
    return supplyChainService.post(
      'nfi/material_assignments_vendor.json',
      data,
    );
  }

  static createCustomerMA(data) {
    return supplyChainService.post(
      'nfi/material_assignments_customer.json',
      data,
    );
  }

  static getMaCustomerListing(params) {
    return supplyChainService.get(`nfi/material_assignments_customer.json`, {
      params,
    });
  }

  static uploadVendorAcknowledgement(id, data) {
    return supplyChainService.put(
      `nfi/material_assignments_vendor/${id}/vendor_acknowledgement.json`,
      data,
    );
  }

  static getMAVendorDetails(id) {
    return supplyChainService.get(`nfi/material_assignments_vendor/${id}.json`);
  }

  static editDcVendorMA(maId, data) {
    return supplyChainService.put(
      `nfi/material_assignments_vendor/${maId}.json`,
      data,
    );
  }

  static adjustReturnDcVendorMA(data) {
    return supplyChainService.post(
      'nfi/material_assignments_vendor/create_transaction_material_assignment',
      data,
    );
  }

  static getAdjustmentReturnDcVendorListing(params) {
    return supplyChainService.get(
      'nfi/material_assignments_vendor/vendor_item_list',
      { params },
    );
  }

  static adjustReturnCustomerMA(data) {
    return supplyChainService.post(
      'nfi/material_assignments_customer/create_transaction_material_assignment',
      data,
    );
  }

  static getAdjustmentReturnCustomerListing(params) {
    return supplyChainService.get(
      'nfi/material_assignments_customer/customer_item_list',
      { params },
    );
  }
}

export default MaterialAssignmentAPI;
