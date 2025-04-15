const { merge } = require('webpack-merge');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { PUBLIC_DIR, DIST_DIR } = require('./paths');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'bundles/[name].[contenthash].js',
    chunkFilename: 'bundles/[name].[contenthash].js',
    sourceMapFilename: 'maps/[name].[contenthash].map.js',
    publicPath: `${process.env.PUBLIC_URL}/`,
  },
  optimization: {
    sideEffects: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        test: /\.js(\?.*)?$/i,
        exclude: /\.map\.js$/,
        terserOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        utilityVendor: {
          test: /[\\/]node_modules[\\/](lodash|lodash-es|formik)[\\/]/,
          name: 'utilityVendor',
        },
        baseVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|styled-components)[\\/]/,
          name: 'baseVendor',
        },
        default: {
          name: 'common',
          minChunks: 3,
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$/,
      exclude: /\.map.js$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PUBLIC_DIR}/icons`, to: 'icons/' },
        `${PUBLIC_DIR}/manifest.json`,
        `${PUBLIC_DIR}/newRelicScript.js`,
      ],
    }),
    new HtmlWebpackPlugin({
      filename: `${DIST_DIR}/index.html`,
      template: `${PUBLIC_DIR}/index.html`,
      chunksSortMode: 'none',
      baseUrl: `${process.env.PUBLIC_URL}/`,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^redux-logger$/,
    }),
    new WorkboxPlugin.GenerateSW({
      mode: process.env.NODE_ENV,
      cacheId: 'medicalapp',
      sourcemap: false,
      cleanupOutdatedCaches: true,
      swDest: 'serviceWorker.js',
      skipWaiting: true,
      clientsClaim: true,
      exclude: [/\.map.js$/],
      include: [
        /\.js$/,
        /\.css$/,
        /\.woff$/,
        /\.woff2$/,
        /\.gif$/,
        /\.svg$/,
        /\.png$/,
        /\.jpg$/,
      ],
    }),
  ],
});
