/* eslint-disable no-undef */
class POApproval {
  elements = {
    menuItem: {
      hamburgerMenu: () => cy.xpath("//button[@aria-label='open drawer']"),
    },

    hyperLink: {
      viewDetail: () =>
        cy.xpath("(//h6[contains(text(),'View Detail')])[position()=1]"),
    },

    buttons: {
      poApprovalButton: () => cy.xpath("//a[contains(.,'PO Approvals')]"),
      approve: () => cy.xpath("//button[normalize-space()='APPROVE']"),
      reject: () => cy.xpath("//button[normalize-space()='REJECT']"),
      submit: () => cy.xpath("//button[normalize-space()='ok']"),
      cancel: () => cy.xpath("//button[normalize-space()='Cancel']"),
      yesbtn: () => cy.xpath("//button[normalize-space()='Yes']"),
    },

    textField: {
      header: () => cy.xpath("//b[contains(text(),'PO')]"),
      vendor: () => cy.get("[data-cy='nfi.poApproval.vendor']"),
      vendorHeader: () => cy.get("[data-cy='nfi.poApproval.vendorHeader']"),
      billToLocation: () => cy.get("[data-cy='nfi.poApproval.billToLocation']"),
      shipTo: () => cy.get("[data-cy='nfi.poApproval.shipTo]"),
      purchaseDate: () => cy.get("[data-cy='nfi.poApproval.purchaseDate']"),
      delivery: () => cy.get("[data-cy='nfi.poApproval.deliveryLocation']"),
      expectedDate: () => cy.get("[data-cy='nfi.poApproval.expectedDate']"),
      quantity: () => cy.xpath("//td[@header='Quantity UpM:']"),
      rate: () => cy.xpath("//td[@header='Rate / UoM:']"),
      gst: () => cy.xpath("//td[@header='GST %']"),
      totalAmount: () => cy.xpath("//td[@header='Total Amount:']"),
      taxableAmount: () => cy.get("[data-cy='nfi.poApprover.taxabaleAmount']"),
      footerGst: () => cy.get("[data-cy='nfi.poApprover.gst']"),
      total: () => cy.xpath("[data-cy='nfi.poApprover.total']"),
      rejectReason: () => cy.xpath("//textarea[@placeholder='Reject Reason']"),
      otherQuotationVendor: () =>
        cy.get("[data-cy='nfi.poApproval.otherQuotationVendor']"),
      paymentTerms: () =>
        cy.xpath("//p[@data-cy='nfi.poApproval.paymentTerms']"),
      note: () => cy.get("[data-cy='nfi.poApproval.note']"),
    },

    file: {
      quotation: () => cy.get("[data-cy='nfi.poApproval.quotation']"),
      otherQuotation: () => cy.get("[data-cy='nfi.poApproval.otherQuotation']"),
    },
  };

  viewPurchaseOrderDetails() {
    this.elements.menuItem.hamburgerMenu().click();
    this.elements.buttons.poApprovalButton().click();
    this.elements.hyperLink.viewDetail().click();
  }

  vendorHeaderField() {
    return this.elements.textField.vendorHeader();
  }

  vendorField() {
    return this.elements.textField.vendor();
  }

  billToField() {
    return this.elements.textField.billToLocation();
  }

  shipToLocation() {
    return this.elements.textField.shipTo();
  }

  purchaseOrderDate() {
    return this.elements.textField.purchaseDate();
  }

  expectedDeliveryDate() {
    return this.elements.textField.expectedDate();
  }

  deliveryLocation() {
    return this.elements.textField.delivery();
  }

  termsAndConditions() {
    return this.elements.textField.paymentTerms();
  }

  additionalNotes() {
    return this.elements.textField.note();
  }

  approvePurchaseOrder() {
    this.elements.buttons.approve().click();
    this.elements.buttons.submit().click();
  }

  rejectPurchaseOrder(rejectReason) {
    this.elements.buttons.reject().click();
    this.elements.textField.rejectReason().clear().type(rejectReason);
    this.elements.buttons.yesbtn().click();
  }
}
export default new POApproval();
