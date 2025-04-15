class PurchaseOrderList {
  elements = {
    addPurchaseOrder: () =>
      cy.get("[data-cy='nfi.poList.createPurchaseOrder']"),
  };
}
export default new PurchaseOrderList();
