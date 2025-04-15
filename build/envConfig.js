module.exports = {
  production: {
    apiUrl: {
      nonFruit: 'https://nfi.vegrow.in',
      supplyChainService: 'https://app.vegrow.in/',
      CRMUrl: 'https://app.vegrow.in/',
      uiAssets: 'https://assets.vegrow.in/',
    },
  },
  staging: {
    apiUrl: {
      nonFruit: 'https://nonfruitstaging.vegrow.in/',
      supplyChainService: 'https://crmstaging.vegrow.in/',
      CRMUrl: 'https://crmstaging.vegrow.in/',
      uiAssets: 'https://qa-assets.vegrow.in/',
    },
  },
  development: {
    apiUrl: {
      nonFruit: 'http://localhost:3001/',
      CRMUrl: 'http://localhost:3000/',
      supplyChainService: 'http://localhost:3000/',
      uiAssets: 'https://qa-assets.vegrow.in/',
    },
  },
  integration: {
    apiUrl: {
      supplyChainService: 'https://crmintegration.vegrow.in/',
      CRMUrl: 'https://crmintegration.vegrow.in/',
      uiAssets: 'https://qa-assets.vegrow.in/',
    },
  },
  integrationtwo: {
    apiUrl: {
      supplyChainService: 'https://crmintegration-two.vegrow.in/',
      CRMUrl: 'https://crmintegration-two.vegrow.in/',
      uiAssets: 'https://qa-assets.vegrow.in/',
    },
  },
};
