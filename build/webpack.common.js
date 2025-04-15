require('dotenv').config();
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const Dotenv = require('dotenv-webpack');

var PACKAGE = require('../package.json');
const PATHS = require('./paths');
const envConfig = require('./envConfig');

// Set Environment
const ENV = process.env.APP_ENV || 'staging';
const Config = envConfig[ENV];

console.log(JSON.stringify(Config));

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: `${PATHS.SRC_DIR}/index.js`,
  },
  output: {
    path: PATHS.DIST_DIR,
    filename: 'bundles/[name].[contenthash].js',
    sourceMapFilename: 'maps/[name].[contenthash].map.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: PATHS.SRC_DIR,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(jpg|png|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[contenthash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[contenthash][ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      App: PATHS.App,
      Components: PATHS.Components,
      Utilities: PATHS.Utilities,
      Services: PATHS.Services,
      constants: PATHS.Constants,
      State: PATHS.State,
      Pages: PATHS.Pages,
      Hooks: PATHS.Hooks,
      Routes: PATHS.Routes,
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      shorthands: true,
      collections: true,
      paths: true,
      caching: true,
      flattening: true,
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(PACKAGE.version),
      ENV: JSON.stringify(ENV),
      PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL),
      API: JSON.stringify(Config.apiUrl)
    }),
    new Dotenv(),
  ],
};