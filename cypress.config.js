/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
const { defineConfig } = require('cypress');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const {
  generateReport,
  uploadToS3,
  addReportToGithub,
} = require('./cypress/cypressUtils');

dayjs.extend(utc);
dayjs.extend(timezone);
const ISTtimestamp = dayjs().tz('Asia/Kolkata').format('DD-MM-YYYY_HH-mm-ss');

const githubEnv = process.env.GITHUB_ENV;

const reporterFormat = {
  template: 'mochawesome',
  charts: true,
  reportPageTitle: 'Non-Fruit UI Automation',
  reportFilename: `Report_${ISTtimestamp}`,
  hideMetadata: true,
  overwrite: false,
  embeddedScreenshots: true,
  inlineAssets: true,
  saveAllAttempts: false,
  html: true,
  json: false,
};

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  video: true,
  reporterOptions: reporterFormat,
  defaultCommandTimeout: 10000,
  screenshotOnRunFailure: true,
  env: {
    nfiUrl: 'http://localhost:9000',
    velynkUrl: 'http://localhost:3000',
  },
  e2e: {
    baseUrl: 'http://localhost:9000',
    retries: 1,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      on('after:run', async () => {
        const reportPath = await generateReport(reporterFormat);
        const reportUrl = await uploadToS3(reportPath, reporterFormat);
        addReportToGithub(githubEnv, reportUrl);
      });

      config.specPattern = ['./cypress/e2e/**/*.cy.js'];
      return config;
    },
  },
});
