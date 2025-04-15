import { generatePath } from 'react-router-dom';

import PATH from './path';

class RouteTransformer {
  // TODO: Subhankur. Remove app from the calling components
  static getTripsListingLink() {
    return PATH.TRIPS_LISTING.URL;
  }

  static getTripsEditLink(id) {
    return generatePath(PATH.EDIT_TRIPS.URL, {
      id,
    });
  }

  static getPrListingLink(tripId) {
    return generatePath(PATH.PAYMENT_REQUEST_LISTING.URL, {
      tripId,
    });
  }

  static getAddPrLink(tripId) {
    return generatePath(PATH.ADD_PAYMENT_REQUEST.URL, {
      tripId,
    });
  }

  static getEditPrLink(tripId, prId) {
    return generatePath(PATH.EDIT_PAYMENT_REQUEST.URL, {
      tripId,
      prId,
    });
  }

  static getAddBalancePrLink(tripId, prId) {
    return generatePath(PATH.ADD_BALANCE_PAYMENT_REQUEST.URL, {
      tripId,
      parentId: prId,
    });
  }

  static getEditBalancePrLink(tripId, parentId, prId) {
    return generatePath(PATH.EDIT_BALANCE_PAYMENT_REQUEST.URL, {
      tripId,
      parentId,
      prId,
    });
  }

  static getAddTripsWithTransferOrderLink(id) {
    return generatePath(PATH.ADD_TRIPS_WITH_TO.URL, {
      toId: id,
    });
  }

  static getTransferOrderListingLink() {
    return PATH.TO_LISTING.URL;
  }

  static getTripsListingLinkForPO(id) {
    return PATH.PAYMENT_REQUEST_LISTING_FOR_PO.URL.replace(':poId', id);
  }

  static getMaterialAssignmentListingLink() {
    return `${PATH.MATERIAL_ASSIGNMENT.URL}/vendors`;
  }

  static getMaterialAssignmentVendorsListing() {
    return `${PATH.MATERIAL_ASSIGNMENT.URL}/dc-vendors`;
  }

  static getMaterialAssignmentCustomersListing() {
    return `${PATH.MATERIAL_ASSIGNMENT.URL}/customers`;
  }

  static getCreateMaterialAssignmentLink() {
    return PATH.ADD_MATERIAL_ASSIGNMENT.URL;
  }

  static getCreateMaterialAssignmentVendorLink() {
    return PATH.ADD_MA_VENDORS.URL;
  }

  static getCreateMaterialAssignmentCustomerLink() {
    return PATH.ADD_MA_CUSTOMERS.URL;
  }

  static getCreateVendorDetails(id) {
    return generatePath(PATH.DC_VENDOR_LEDGER.URL, {
      id,
    });
  }

  static getCreateCustomerLedger(id) {
    return generatePath(PATH.MA_CUSTOMER_LEDGER.URL, {
      id,
    });
  }

  static getMaterialAssignmentEditLink(materialId) {
    return generatePath(PATH.EDIT_MATERIAL_ASSIGNMENT.URL, {
      materialId,
    });
  }

  static getCreateReceivingLink(materialId) {
    return generatePath(PATH.RECEIVE_MATERIAL_ASSIGNMENT.URL, {
      materialId,
    });
  }

  static getInventoryAuditCreation() {
    return PATH.INVENTORY_AUDIT_CREATE.URL;
  }

  static getAudits() {
    return PATH.AUDITS.URL;
  }

  static getAuditApproval() {
    return PATH.AUDIT_APPROVAL.URL;
  }

  static viewInventoryAudit(auditId) {
    return generatePath(PATH.INVENTORY_AUDIT_VIEW.URL, {
      auditId,
    });
  }

  static editInventoryAudit(auditId) {
    return generatePath(PATH.INVENTORY_AUDIT_EDIT.URL, {
      auditId,
    });
  }

  static reviewInventoryAudit(auditId) {
    return generatePath(PATH.INVENTORY_AUDIT_REVIEW.URL, {
      auditId,
    });
  }

  static getEditVendorMA(maId) {
    return generatePath(PATH.EDIT_MA_VENDORS.URL, {
      maId,
    });
  }

  static getAdjustMAVendor(vendorId) {
    return generatePath(PATH.ADJUST_MA_VENDORS.URL, {
      vendorId,
    });
  }

  static getAdjustMACustomer(customerId) {
    return generatePath(PATH.ADJUST_MA_CUSTOMERS.URL, {
      customerId,
    });
  }

  static getReturnMAVendor(vendorId) {
    return generatePath(PATH.RETURN_MA_VENDORS.URL, {
      vendorId,
    });
  }

  static getReturnMACustomer(customerId) {
    return generatePath(PATH.RETURN_MA_CUSTOMERS.URL, {
      customerId,
    });
  }

  static getCloneMA() {
    return PATH.CLONE_MA.URL;
  }

  static getLoginPath() {
    return `/${PATH.LOGIN.URL}`;
  }

  static getPurchaseOrderViewPage(id) {
    return generatePath(PATH.PO_ADD_EDIT.URL, { id, accessType: 'read-only' });
  }
}

export default RouteTransformer;
