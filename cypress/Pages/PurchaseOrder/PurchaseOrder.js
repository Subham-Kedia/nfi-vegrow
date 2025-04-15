/* eslint-disable no-undef */
class PurchaseOrder {
  elements = {
    buttons: {
      addPurchaseOrder: () =>
        cy.get("[data-cy='nfi.poList.createPurchaseOrder']"),
      addVendor: () => cy.xpath("//button[normalize-space()='Add Vendor']"),
      dismiss: () => cy.xpath("//button[normalize-space()='Dismiss']"),
      reloadPage: () => cy.xpath("//button[normalize-space()='Reload Page']"),
      addOtherQuotation: () => cy.xpath("//button[normalize-space()='Add']"),
      otherQuotationRemove: () =>
        cy.xpath("(//button[@data-cy='nfi.po.otherQuotationRemove'])[last()]"),
      saveAndClose: () => cy.xpath("//button[@type='submit']"),
      cancel: () => cy.xpath("//button[normalize-space()='Cancel']"),
      addMultipleItem: () =>
        cy.get("[data-testid='AddCircleOutlineOutlinedIcon']"),
      cancelMultipleItem: () =>
        cy.xpath("(//*[@data-testid='CancelOutlinedIcon'])[last()]"),
      removeQuotation: () =>
        cy.xpath("(//button[normalize-space()='Remove'])[last()]"),
      editPurchaseOrder: () =>
        cy.xpath("(//*[name()='svg']/parent::a)[position()=1]"),
    },

    textField: {
      header: () => cy.xpath("//h2['Add Purchase Order']"),
      bannerAlert: () => cy.xpath("//div[@role='alert']"),
      snackBar: () => cy.xpath("//div[@id='notistack-snackbar']"),
      zeroErrorText: () =>
        cy.xpath("//p[contains(text(),'Value should be greater than 0')]"),
      otherQuotationText: () =>
        cy.xpath("//strong[normalize-space()='Quotation L2']"),
      requiredError: () => cy.xpath("//p[contains(text(),'Required')]"),
    },

    inputField: {
      purchaseOrdeType: () => cy.get("[data-cy='nfi.po.poType']"),
      selectPurchaseOrderType: (index) =>
        cy.xpath(`//div[@id='menu-purchase_order_type']//li[${index}]`),
      vendor: () => cy.xpath("//input[@id='partner']"),
      vendorList: () => cy.get("li[id*='partner-option']"),
      purchaseOrderDate: () => cy.get("[data-cy='nfi.po.purchaseDate']"),
      deliveryDC: () => cy.xpath("//input[@id='delivery_dc']"),
      deliveryDCList: () => cy.get("li[id*='delivery_dc-option']"),
      billToLocation: () => cy.xpath("//input[@id='bill_to_location']"),
      billToLocationList: () => cy.get("li[id*='bill_to_location-option']"),
      purchaseDate: () => cy.get("[data-cy='nfi.po.purchaseDate']"),
      expectedDate: () => cy.get("[data-cy='nfi.po.expectedDate']"),
      packagingItem: () =>
        cy.xpath("(//div[@data-cy='nfi.po.packagingItem']//input)[last()]"),
      packagingItemList: () =>
        cy.xpath("//li[contains(@id, '.nfi_packaging_item-option')]"),
      quantity: () =>
        cy.xpath("(//div[@data-cy='nfi.po.quantity']//input)[last()]"),
      rate: () => cy.xpath("(//div[@data-cy='nfi.po.rateUom']//input)[last()]"),
      gst: () => cy.xpath("(//div[@data-cy='nfi.po.gst'])[last()]"),
      selectGst: (gst) => cy.xpath(`(//p[normalize-space()='${gst}'])[last()]`),
      paymentTerms: () => cy.get("[data-cy='nfi.po.payment_terms']"),
      comments: () => cy.get("[data-cy='nfi.po.comments']"),
      uploadQuotation: () => cy.xpath("//input[@id='quotation_l1']"),
      otherQuotationVendor: () =>
        cy.xpath("(//div[@data-cy='nfi.po.otherQuotationVendors'])"),
      otherQuotationVendorList: () =>
        cy.xpath("(//li[contains(@id,'.partner-option')])[last()]"),
      otherQuotationUpload: () =>
        cy.xpath("(//input[@data-cy='nfi.po.otherQuotationUpload'])[last()]"),
      imageuploadVerification: () => cy.xpath('(//img)[last()]'),
      otherQuotationCard: () => cy.get("[data-cy='nfi.po.otherQuotationCard']"),
      conversionRate: () =>
        cy.xpath("(//div[@data-cy='nfi.po.conversionRate']//input)[last()]"),
      uom: () => cy.get("[data-cy='nfi.po.Uom']>div"),
      uomList: () => cy.xpath("//li[@role='option']"),
    },
  };

  purchaseOrderCreate() {
    this.elements.buttons.addPurchaseOrder().click();
    return this.elements.textField.header();
  }

  selectPOType(poType) {
    this.elements.inputField.purchaseOrdeType().click();
    this.elements.inputField.selectPurchaseOrderType(poType).click();
  }

  getVendor(vendorName = '') {
    this.elements.inputField.vendor().type(vendorName);
    cy.selectDropDown(this.elements.inputField.vendorList(), vendorName);
  }

  getPurchaseDate(purchaseDate) {
    return this.elements.inputField.purchaseDate().type(purchaseDate);
  }

  getExpectedDeliveryDate(expectedDate) {
    return this.elements.inputField.expectedDate().type(expectedDate);
  }

  getDeliveryLocation(deliveryDC = '') {
    this.elements.inputField.deliveryDC().type(deliveryDC);
    cy.selectDropDown(this.elements.inputField.deliveryDCList(), deliveryDC);
  }

  getBillToLocation(billToLocation = '') {
    this.elements.inputField.billToLocation().type(billToLocation);
    cy.selectDropDown(
      this.elements.inputField.billToLocationList(),
      billToLocation,
    );
  }

  getPackagingItem(packagingItem = '') {
    this.elements.inputField.packagingItem().type(packagingItem);
    cy.selectDropDown(
      this.elements.inputField.packagingItemList(),
      packagingItem,
    );
  }

  selectUom(uom) {
    this.elements.inputField.uom().click();
    cy.selectDropDown(this.elements.inputField.uomList(), uom);
  }

  getConversionRate(conversionRate = ' ') {
    this.elements.inputField.conversionRate().type(conversionRate);
  }

  getQuantity(quantity = 0) {
    return this.elements.inputField.quantity().type(quantity);
  }

  getRate(rate = 0) {
    return this.elements.inputField.rate().type(rate);
  }

  selectGST(gst = '') {
    this.elements.inputField.gst().click();
    this.elements.inputField.selectGst(gst).click();
  }

  getPaymentTerms(paymentTerms = '') {
    return this.elements.inputField.paymentTerms().type(paymentTerms);
  }

  getComments(comments = '') {
    return this.elements.inputField.comments().type(comments);
  }

  quotationUpload(fileName = '') {
    cy.uploadFile(this.elements.inputField.uploadQuotation(), fileName);
  }

  addMultipleQuotation(vendorName = '', filename = '') {
    this.elements.buttons.addOtherQuotation().click();
    this.elements.inputField.otherQuotationVendor().type(vendorName);
    cy.selectDropDown(
      this.elements.inputField.otherQuotationVendorList(),
      vendorName,
    );
    cy.uploadFile(this.elements.inputField.otherQuotationUpload(), filename);
  }

  removeOtherQuotation() {
    return this.elements.buttons.removeQuotation();
  }

  submit() {
    return this.elements.buttons.saveAndClose().click();
  }

  messageHandler(value = true) {
    if (value) {
      return this.elements.textField.snackBar();
    }

    return this.elements.textField.zeroErrorText();
  }
}
export default new PurchaseOrder();
