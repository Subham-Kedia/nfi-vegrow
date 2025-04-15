/* eslint-disable no-undef */
class Login {
  elements = {
    inputField: {
      username: () => cy.get("[data-cy='nfi.loginPage.userNameInputField']"),
      password: () => cy.get("[data-cy='nfi.loginPage.passwordInputField']"),
    },

    button: {
      loginbtn: () => cy.get("[data-cy='nfi.loginPage.loginButton']"),
    },

    textField: {
      snackBar: () => cy.xpath("//div[@id='notistack-snackbar']"),
      requiredField: () => cy.xpath("//p[contains(text(),'Required')]"),
    },
  };

  enterUsername() {
    return this.elements.inputField.username();
  }

  enterPassword() {
    return this.elements.inputField.password();
  }

  submit() {
    this.elements.button.loginbtn().click();
  }
}
export default new Login();
