// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');
const { readFileSync, appendFile } = require('fs');
const { join } = require('path');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

const generateReport = async (reporterFormat) => {
  const mergedReport = await merge({
    files: ['./cypress/reports/html/.jsons/*.json'],
  });

  await generator.create(mergedReport, {
    reportDir: './cypress/reports/html',
    reportFilename: reporterFormat.reportFilename,
    reportTitle: 'NFI-UI',
  });

  return `./reports/html/${reporterFormat.reportFilename}.html`;
};

const uploadToS3 = async (filePath, reporterFormat) => {
  const fileContent = readFileSync(join(__dirname, filePath), 'utf-8');
  const bucketName = 'automation-e2e-reports/NFI-UI';
  const s3 = new AWS.S3();
  const s3params = {
    Bucket: bucketName,
    Key: reporterFormat.reportFilename,
    Body: fileContent,
    ContentType: 'text/html',
  };

  const result = await s3.upload(s3params).promise();
  console.log('Report uploaded to S3:', result.Location);
  return result.Location;
};

const addReportToGithub = (githubEnv, reportUrl) => {
  if (githubEnv) {
    appendFile(githubEnv, `REPORT_URL=${reportUrl}\n`, (err) => {
      if (err) {
        console.error('Error while adding file:', err);
      } else {
        console.log('REPORT_URL successfully added');
      }
    });
  } else {
    console.error('ENV is not defined');
  }
};

module.exports = {
  generateReport,
  uploadToS3,
  addReportToGithub,
};
