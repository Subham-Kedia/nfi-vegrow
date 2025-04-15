/* eslint-disable no-undef */
import Login from '../Pages/Login';

describe('Login', () => {
  let data;
  before(() => {
    cy.fixture('Login').then((testData) => {
      data = testData;
    });
  });
  beforeEach(() => {
    cy.visit('/');
  });

  it('Verify with Valid Credentials', () => {
    Login.enterUsername().should('be.visible').type(data.username);
    Login.enterPassword().should('be.visible').type(data.password);
    Login.submit();
    cy.contains('Purchase Orders');
  });
  it('Verify with Invalid Username', () => {
    Login.enterUsername().should('be.visible').type(data.invalidUsername);
    Login.enterPassword().should('be.visible').type(data.password);
    Login.submit();
    Login.elements.textField.snackBar().should('have.text', data.errorMessage);
  });
  it('Verify with Invalid Password', () => {
    Login.enterUsername().should('be.visible').type(data.username);
    Login.enterPassword().should('be.visible').type(data.invalidPassword);
    Login.submit();
    Login.elements.textField.snackBar().should('have.text', data.errorMessage);
  });
  it('Verify with Empty Credentials', () => {
    Login.submit();
    Login.elements.textField
      .requiredField()
      .should('have.text', data.requiredError);
  });
});
