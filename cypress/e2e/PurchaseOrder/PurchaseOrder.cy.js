/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import { API_ENDPOINT, ROUTES } from '../../constants/endpoint';
import DCArrival from '../../Pages/DCArrival';
import Inventory from '../../Pages/Inventory';
import POApproval from '../../Pages/POApproval';
import PurchaseOrder from '../../Pages/PurchaseOrder/PurchaseOrder';

describe('Purchase Order', () => {
  let data;
  let velynkUrl;
  let nfiUrl;
  let poId;
  let dcData;
  before(() => {
    nfiUrl = Cypress.env('nfiUrl');
    velynkUrl = Cypress.env('velynkUrl');

    cy.fixture('PurchaseOrder').then((testData) => {
      data = testData;
    });
    cy.fixture('DCArrival').then((testData) => {
      dcData = testData;
    });

    cy.getEpochTime().then((time) => {
      data.payload.purchase_order.purchase_date = time;
      data.payload.purchase_order.expected_delivery_date = time;
    });

    cy.authKey().then((response) => {
      const auth = response.headers.authorization;
      data.header.Authorization = auth;
      cy.getBlobResponse(
        velynkUrl + API_ENDPOINT.directUpload,
        data.header,
      ).then((res) => {
        data.payload.quotation_l1 = res[0];
        cy.apiRequest(
          data.method,
          velynkUrl + API_ENDPOINT.createPurchaseOrder,
          data.header,
          data.payload,
        ).then((data) => {
          if (data.status === 200) {
            poId = data.body.id;
          } else {
            throw new Error(`Cannot create purchase Order${data.status}`);
          }
        });
      });
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.login(data.username, data.password);
  });

  it('Check for Header and Empty values in Add Purchase Order', () => {
    PurchaseOrder.purchaseOrderCreate().should(
      'have.text',
      data.addPurchaseOderHeader,
    );
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getPackagingItem(data.packagingItem[0]);
    PurchaseOrder.elements.buttons.addOtherQuotation().click();
    PurchaseOrder.submit();
    PurchaseOrder.elements.textField.requiredError().contains('Required');
  });

  it('Creating a Purchase Order with Packaging item without Market Uom', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate().then((date) => {
      PurchaseOrder.getPurchaseDate(date)
        .should('be.visible')
        .and('not.be.disabled');
      PurchaseOrder.getExpectedDeliveryDate(date)
        .should('be.visible')
        .and('not.be.disabled');
    });
    PurchaseOrder.getDeliveryLocation(data.deliveryLocation);
    PurchaseOrder.getBillToLocation(data.billToLocation);
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.elements.inputField
      .uom()
      .invoke('text')
      .should('equal', data.systemUom);
    PurchaseOrder.elements.inputField.conversionRate().should('not.be.visible');
    PurchaseOrder.getQuantity(data.quantity[0])
      .should('be.visible')
      .and('not.be.disabled');
    PurchaseOrder.getRate(data.rate[0])
      .should('be.visible')
      .and('not.be.disabled');
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms)
      .should('be.visible')
      .and('not.be.disabled');
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.elements.inputField
      .imageuploadVerification()
      .should('exist')
      .and('be.visible');
    PurchaseOrder.getComments(data.comments)
      .should('be.visible')
      .and('not.be.disabled');
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler()
      .should('be.visible')
      .and('have.text', data.poCreationMessage);
  });

  it('Creating a Purchase Order with Packaging item with Market Uom', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate().then((date) => {
      PurchaseOrder.getPurchaseDate(date);
      PurchaseOrder.getExpectedDeliveryDate(date);
    });
    PurchaseOrder.getDeliveryLocation(data.deliveryLocation);
    PurchaseOrder.getBillToLocation(data.billToLocation);
    PurchaseOrder.getPackagingItem(data.packagingItem[0]);
    PurchaseOrder.selectUom(data.marketUom);
    PurchaseOrder.elements.inputField.conversionRate().should('be.visible');
    PurchaseOrder.getConversionRate(data.conversionRate);
    PurchaseOrder.getQuantity(data.quantity[0]);
    PurchaseOrder.getRate(data.rate[0]);
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.elements.inputField
      .imageuploadVerification()
      .should('exist')
      .and('be.visible');
    PurchaseOrder.getComments(data.comments)
      .should('be.visible')
      .and('not.be.disabled');
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler()
      .should('be.visible')
      .and('have.text', data.poCreationMessage);
  });

  it('Verify can able to edit the PO type, Packaging item, Quantity , Rate & GST', () => {
    PurchaseOrder.elements.buttons.editPurchaseOrder().click();
    cy.getUrl().should('include', nfiUrl + ROUTES.editPurchaseOrderUrl + poId);
    PurchaseOrder.selectPOType(data.OPEN_PURCHASE_ORDER);
    PurchaseOrder.getPackagingItem(data.packagingItem[0]);
    PurchaseOrder.selectUom(data.marketUom);
    PurchaseOrder.elements.inputField.conversionRate().should('be.visible');
    PurchaseOrder.getConversionRate(data.conversionRate);
    PurchaseOrder.getQuantity(data.quantity[0]);
    PurchaseOrder.getRate(data.rate[1]);
    PurchaseOrder.selectGST(data.gst[1]);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler()
      .should('be.visible')
      .and('have.text', data.poEditMessage);
  });

  it('Verify that User cannot able to create Purchase order with Past and Future date', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate(1).then((date) => {
      PurchaseOrder.getPurchaseDate(date);
      PurchaseOrder.getExpectedDeliveryDate(date);
    });
    PurchaseOrder.getDeliveryLocation(data.deliveryLocation);
    PurchaseOrder.getBillToLocation(data.billToLocation);
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.getQuantity(data.quantity[0]);

    PurchaseOrder.getRate(data.rate[0]);
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.getComments(data.comments);
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler()
      .should('be.visible')
      .and('have.text', data.olderPurchaseDate);
    cy.reload();

    // Futute Purchase Date
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate(-2).then((date) => {
      PurchaseOrder.getPurchaseDate(date);
      PurchaseOrder.getExpectedDeliveryDate(date);
    });
    PurchaseOrder.getDeliveryLocation(data.deliveryLocation);
    PurchaseOrder.getBillToLocation(data.billToLocation);
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.getQuantity(data.quantity[0]);

    PurchaseOrder.getRate(data.rate[0]);
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.getComments(data.comments);
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler()
      .should('be.visible')
      .and('have.text', data.futurePurchaseDate);
  });

  // Since there is no BE validation configured for this test case, hence it is skipped now
  it.skip('Verify that user cannot able to create Purchase order with delivery date < purchase date', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate(-1).then((date) => {
      PurchaseOrder.getPurchaseDate(date);
    });
    cy.getCurrentDate(1).then((date) => {
      PurchaseOrder.getExpectedDeliveryDate(date);
    });
    PurchaseOrder.getDeliveryLocation(data.deliveryLocation);
    PurchaseOrder.getBillToLocation(data.billToLocation);
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.getQuantity(data.quantity[0]);

    PurchaseOrder.getRate(data.rate[0]);
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.getComments(data.comments);
    PurchaseOrder.submit();
    // PurchaseOrder.messageHandler()
    //   .should('be.visible')
    //   .and('have.text', data.poCreationMessage);
  });

  it('Creating a Purchase Order with Multiple Packaging Items', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate().then((date) => {
      PurchaseOrder.getPurchaseDate(date);
      PurchaseOrder.getExpectedDeliveryDate(date);
    });
    PurchaseOrder.getDeliveryLocation(data.deliveryLocation);
    PurchaseOrder.getBillToLocation(data.billToLocation);
    for (let i = 0; i < data.packagingItem.length; i++) {
      PurchaseOrder.getPackagingItem(data.packagingItem[i]);
      if (data.packagingItem[i] === data.packagingItem[0]) {
        PurchaseOrder.selectUom(data.marketUom);
        PurchaseOrder.getConversionRate(data.conversionRate);
      }
      PurchaseOrder.getQuantity(data.quantity[i]);
      PurchaseOrder.getRate(data.rate[i]);
      PurchaseOrder.selectGST(data.gst[i]);
      if (i < data.packagingItem.length - 1) {
        PurchaseOrder.elements.buttons.addMultipleItem().click();
      }
    }
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.getComments(data.comments);
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler()
      .should('be.visible')
      .and('have.text', data.poCreationMessage);
  });

  it('Check creating Purchase Order Zero and Negative Quantity and Rate are not allowed', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.getQuantity(data.negativeQuantity);
    cy.realPress('Tab');
    PurchaseOrder.messageHandler(false).contains(data.zeroNegativeText);
    PurchaseOrder.getRate(data.zeroRate);
    cy.realPress('Tab');
    PurchaseOrder.messageHandler(false).contains(data.zeroNegativeText);
  });

  it('Creating a Open Purchase Order', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.OPEN_PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate().then((date) => {
      PurchaseOrder.getPurchaseDate(date).should('be.visible');
    });
    PurchaseOrder.elements.inputField.expectedDate().should('not.exist');
    PurchaseOrder.elements.inputField.deliveryDC().should('not.exist');
    PurchaseOrder.elements.inputField.billToLocation().should('not.exist');
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.getQuantity(data.quantity[0]);
    PurchaseOrder.getRate(data.rate[0]);
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.getComments(data.comments);
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler()
      .should('be.visible')
      .and('have.text', data.poCreationMessage);
  });

  it('Check whether Add Vendor Button Redirects to CRM Panel', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.elements.buttons.addVendor().click();
    PurchaseOrder.elements.textField
      .bannerAlert()
      .should('exist')
      .contains(data.bannerAlertMessage);
    PurchaseOrder.elements.buttons.reloadPage().should('exist');
    PurchaseOrder.elements.buttons.dismiss().should('exist');
  });

  it('Check the functionality of Reload & Dismiss', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.elements.buttons.addVendor().click();
    PurchaseOrder.elements.buttons.reloadPage().should('exist').click();
    PurchaseOrder.elements.inputField.vendor().should('not.exist');

    PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
    PurchaseOrder.elements.buttons.addVendor().click();
    PurchaseOrder.elements.buttons.dismiss().click();
    PurchaseOrder.elements.textField.bannerAlert().should('not.exist');
  });

  it('Check user can able to add other quotations', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.OPEN_PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate().then((date) => {
      PurchaseOrder.getPurchaseDate(date).should('be.visible');
    });
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.getQuantity(data.quantity[0]);
    PurchaseOrder.getRate(data.rate[0]);
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.elements.inputField
      .imageuploadVerification()
      .should('exist')
      .and('be.visible');
    PurchaseOrder.addMultipleQuotation(
      data.otherQuotationVendor,
      data.uploadFile,
    );
    PurchaseOrder.elements.inputField
      .imageuploadVerification()
      .should('exist')
      .and('be.visible');
  });

  it('Verify can able to create PO with multiple Quotation with same vendor', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.OPEN_PURCHASE_ORDER);
    PurchaseOrder.getVendor(data.vendor);
    cy.getCurrentDate().then((date) => {
      PurchaseOrder.getPurchaseDate(date);
    });
    PurchaseOrder.getPackagingItem(data.packagingItem[1]);
    PurchaseOrder.getQuantity(data.quantity[0]);
    PurchaseOrder.getRate(data.rate[0]);
    PurchaseOrder.selectGST(data.gst[0]);
    PurchaseOrder.getPaymentTerms(data.paymentTerms);
    PurchaseOrder.quotationUpload(data.uploadFile);
    PurchaseOrder.addMultipleQuotation(data.vendor, data.uploadFile);
    PurchaseOrder.submit();
    PurchaseOrder.messageHandler().should(
      'have.text',
      data.sameVendorQuotationMessage,
    );
  });

  it('Verify can able to remove the Other Quotation', () => {
    PurchaseOrder.purchaseOrderCreate();
    PurchaseOrder.selectPOType(data.OPEN_PURCHASE_ORDER);
    PurchaseOrder.addMultipleQuotation(data.vendor, data.uploadFile);
    PurchaseOrder.removeOtherQuotation().should('exist').click();
    PurchaseOrder.elements.inputField.otherQuotationCard().should('not.exist');
  });

  it('Purchase Order E2E Flow', () => {
    let purchaseOrderId;
    let deliveryId;
    let inventory;

    cy.apiRequest(
      data.getMethod,
      velynkUrl + API_ENDPOINT.getInventory(1),
      data.header,
    ).then((resdata) => {
      inventory = resdata.body.items[0]?.available_quantity || 0;
    });

    // Create Purchase Order
    cy.getCurrentDate().then((date) => {
      PurchaseOrder.purchaseOrderCreate();
      PurchaseOrder.selectPOType(data.PURCHASE_ORDER);
      PurchaseOrder.getVendor(data.vendor);
      PurchaseOrder.getPurchaseDate(date);
      PurchaseOrder.getExpectedDeliveryDate(date);
      PurchaseOrder.getDeliveryLocation(data.deliveryLocation);
      PurchaseOrder.getBillToLocation(data.billToLocation);
      PurchaseOrder.getPackagingItem(data.packagingItem[1]);
      PurchaseOrder.getQuantity(data.quantity[0]);
      PurchaseOrder.getRate(data.rate[0]);
      PurchaseOrder.selectGST(data.gst[0]);
      PurchaseOrder.getPaymentTerms(data.paymentTerms);
      PurchaseOrder.quotationUpload(data.uploadFile);
      PurchaseOrder.getComments(data.comments);
      cy.apiIntercept(
        data.method,
        velynkUrl + API_ENDPOINT.createPurchaseOrder,
        data.createPOAlias,
      );
      PurchaseOrder.submit();
      PurchaseOrder.messageHandler()
        .should('be.visible')
        .and('have.text', data.poCreationMessage);
      cy.wait(`@${data.createPOAlias}`).then((podata) => {
        purchaseOrderId = podata.response.body.id;

        // Purchase Order Approval
        POApproval.viewPurchaseOrderDetails();
        cy.getUrl().should(
          'include',
          nfiUrl + ROUTES.poApproval + purchaseOrderId,
        );
        cy.apiIntercept(
          data.updateMethod,
          velynkUrl + API_ENDPOINT.approvePO(purchaseOrderId),
          data.approvePOAlias,
        );
        POApproval.approvePurchaseOrder();
        PurchaseOrder.messageHandler()
          .should('be.visible')
          .and('have.text', data.poApproveMessage);
        cy.wait(`@${data.approvePOAlias}`).then((approvedata) => {
          deliveryId =
            approvedata.response.body.non_fruit_shipments[0].delivery
              .identifier;

          // DC Arrival
          DCArrival.navigateDCArrival();
          DCArrival.deliveryIdentifier()
            .should('have.text', deliveryId)
            .click();
          DCArrival.recordArrival();
          DCArrival.elements.textField
            .snackBar()
            .should('have.text', dcData.recordArrivalMsg);
          DCArrival.receiveMaterial();
          DCArrival.getQuantity().type(data.quantity[0]);
          DCArrival.getTransportationCharge().type(0);
          DCArrival.getPackagingCharge().type(0);
          DCArrival.uploadAttachment(1, data.uploadFile);
          DCArrival.submit();
          DCArrival.elements.textField
            .snackBar()
            .should('have.text', dcData.receivedMsg);
        });
      });
    });

    // Inventory
    Inventory.navigateInventory();
    const exptext = data.packagingItem[1].replace(/\//g, '[ /]?');
    Inventory.itemName()
      .invoke('text')
      .then((text) => {
        expect(text).to.match(new RegExp(exptext));
      });
    Inventory.availableQuanity()
      .invoke('text')
      .then((value) => {
        expect(value).to.include(inventory + data.quantity[0]);
      });
  });
});
