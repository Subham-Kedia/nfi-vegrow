/* eslint-disable no-undef */
class DCArrival {
  elements = {
    menuItems: {
      hamburgerMenu: () => cy.xpath("//button[@aria-label='open drawer']"),
      dcArrival: () => cy.xpath("//span[normalize-space()='DC Arrivals']"),
    },

    buttons: {
      recordArrivalbtn: () =>
        cy.xpath("//button[normalize-space()='Record Arrival']"),
      saveArrival: () =>
        cy.xpath("//button[normalize-space()='SAVE ARRIVAL DETAILS']"),
      receiveMaterialbtn: () =>
        cy.xpath("//button[normalize-space()='Receive Materials']"),
      submitBtn: () => cy.xpath("//button[@type='submit']"),
      cancelBtn: () => cy.xpath("//button[normalize-space()='Cancel']"),
      saveBtn: () => cy.xpath("//button[normalize-space()='Save']"),
      uploadBill: () => cy.xpath("//button[normalize-space()='Upload bill']"),
      pendingTab: () => cy.xpath("//button[contains(text(),'Pending')]"),
      receivedTab: () => cy.xpath("//button[contains(text(),'Received')]"),
    },

    inputField: {
      receivedQuantity: (n = 1) =>
        cy.xpath(
          `(//div[@data-cy='nfi.dcArrival.Qty']//input)[position()=${n}]`,
        ),
      transportationCharge: () =>
        cy.xpath(
          "(//div[@data-cy='nfi.dcArrival.OtherCharges']//input)[position()=1]",
        ),
      packagingCharge: () =>
        cy.xpath(
          "(//div[@data-cy='nfi.dcArrival.OtherCharges']//input)[position()=2]",
        ),
      transportationGst: () =>
        cy.xpath("(//div[@data-cy='nfi.dcArrival.gst'])[position()=1]"),
      packagingGst: () =>
        cy.xpath("(//div[@data-cy='nfi.dcArrival.gst'])[position()=2]"),
      gstList: () =>
        cy.xpath("//div[contains(@id,'menu-other_bill_charges')]//li"),
      billNumber: () => cy.get("[placeholder='Bill Number']"),
      selectDc: () => cy.xpath("//div[@data-cy='selectDC']//button"),
      dcList: () => cy.xpath("[data-cy='dcList']"),
      attachBill: () => cy.get("[id='payment_request_bill']"),
    },

    textField: {
      deliveryId: () =>
        cy.xpath(
          "(//div[@data-cy='nfi.dcArrival.DeliveryInfo']/div)[position()=1]",
        ),
      source: () =>
        cy.xpath(
          "(//div[@data-cy='nfi.dcArrival.DeliveryInfo'])[position()=2]",
        ),
      createdAt: () =>
        cy.xpath(
          "(//div[@data-cy='nfi.dcArrival.DeliveryInfo'])[position()=3]",
        ),
      items: () =>
        cy.xpath(
          "(//div[@data-cy='nfi.dcArrival.DeliveryInfo'])[position()=4]",
        ),
      transferQuantity: (n = 1) =>
        cy.xpath(
          `(//p[@data-cy='nfi.dcArrival.transferQty'])[position()=${n}]`,
        ),
      gap: (n = 1) =>
        cy.xpath(`(//p[@data-cy='nfi.dcArrival.Gap'])[position()=${n}]`),
      itemId: (n = 1) =>
        cy.xpath(`(//p[@data-cy="nfi.dcArrival.ItemID"])[position()=${n}]`),
      transportationTotal: () =>
        cy.xpath("(//p[@data-cy='nfi.dcArrival.total'])[position()=1]"),
      packagingTotal: () =>
        cy.xpath("(//p[@data-cy='nfi.dcArrival.total'])[position()=2]"),
      destination: () =>
        cy.xpath("(//p[@data-cy='nfi.dcArrival.delivery'])[position()=1]"),
      sourceDetail: () =>
        cy.xpath("(//p[@data-cy='nfi.dcArrival.delivery'])[position()=2]"),
      requiredText: () => cy.xpath("//p[contains(text(),'Required')]"),
      snackBar: () => cy.xpath("//div[@id='notistack-snackbar']"),
    },
  };

  navigateDCArrival() {
    this.elements.menuItems.hamburgerMenu().click();
    this.elements.menuItems.dcArrival().click();
  }

  deliveryIdentifier() {
    return this.elements.textField.deliveryId();
  }

  recordArrival() {
    this.elements.buttons.recordArrivalbtn().click();
    this.elements.buttons.saveArrival().click();
  }

  receiveMaterial() {
    this.elements.buttons.receiveMaterialbtn().click();
  }

  getQuantity() {
    return this.elements.inputField.receivedQuantity();
  }

  getTransportationCharge() {
    return this.elements.inputField.transportationCharge();
  }

  getPackagingCharge() {
    return this.elements.inputField.packagingCharge();
  }

  uploadAttachment(billNum, file) {
    this.elements.buttons.uploadBill().click();
    this.elements.inputField.billNumber().type(billNum);
    cy.uploadFile(this.elements.inputField.attachBill(), file);
    this.elements.buttons.saveBtn().click();
  }

  submit() {
    this.elements.buttons.submitBtn().click();
  }

  cancel() {
    this.elements.buttons.cancelBtn().click();
  }
}
export default new DCArrival();
