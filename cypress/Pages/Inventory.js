/* eslint-disable no-undef */
class Inventory {
  elements = {
    menuItem: {
      hamburgerMenu: () => cy.xpath("//button[@aria-label='open drawer']"),
      inventory: () => cy.xpath("//span[normalize-space()='Inventory']"),
    },

    textField: {
      itemId: () => cy.get("[data-cy='nfi.inventory.itemId']"),
      availableQty: () => cy.get("[data-cy='nfi.inventory.availableQty']"),
    },
  };

  navigateInventory() {
    this.elements.menuItem.hamburgerMenu().click();
    this.elements.menuItem.inventory().click();
  }

  itemName() {
    return this.elements.textField.itemId();
  }

  availableQuanity() {
    return this.elements.textField.availableQty();
  }
}
export default new Inventory();
