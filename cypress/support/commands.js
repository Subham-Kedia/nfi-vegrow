/* eslint-disable no-undef */
import Login from '../Pages/Login';

Cypress.Commands.add('login', (username, password) => {
  Login.enterUsername().type(username);
  Login.enterPassword().type(password);
  Login.submit();
});

Cypress.Commands.add('getCurrentDate', (pastDate = 0, onlyDay = false) => {
  const date = new Date();
  date.setDate(date.getDate() - pastDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return cy.wrap(onlyDay ? day : `${day}/${month}/${year}`);
});

Cypress.Commands.add('uploadFile', (locator, file) => {
  locator.selectFile(file, { force: true });
});

Cypress.Commands.add('selectDropDown', (locator, value) => {
  locator.contains(value).click();
});

Cypress.Commands.add('apiIntercept', (methodName, url, alias) => {
  return cy
    .intercept({
      method: methodName,
      url,
    })
    .as(alias);
});

Cypress.Commands.add('getUrl', () => {
  return cy.url();
});

Cypress.Commands.add(
  'apiRequest',
  (methodName, url, headerBody, requestBody) => {
    return cy.request({
      method: methodName,
      url,
      headers: headerBody,
      body: requestBody,
      failOnStatusCode: false,
    });
  },
);

Cypress.Commands.add('authKey', () => {
  return cy.apiRequest(
    'POST',
    'http://localhost:3000/login',
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    {
      user: {
        username: 'nfiuser1@gmail.com',
        password: 'test123',
      },
    },
  );
});

Cypress.Commands.add('getEpochTime', () => {
  return Date.now();
});

Cypress.Commands.add('getBlobResponse', (url, header) => {
  const blobBody = {
    blob: {
      filename: 'test.png',
      content_type: 'image/png',
      checksum: 141045,
      byte_size: 'bHExmeOxnXvFnJYJ/31k4g==',
    },
  };
  return cy.apiRequest('POST', url, header, blobBody).then((response) => {
    const signedId = response.body.signed_id;
    return [signedId, response];
  });
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
