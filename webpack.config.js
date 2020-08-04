const path = require('path');

const NODE_BUNDLE = 'index.js';
const WEB_BUNDLE = 'floppy-filter.min.js';

const getConfig = (name, platform, dist) => {
  const config = {
    entry: './src/index.js',
    target: platform,
    output: {
      filename: name,
      path: path.resolve(__dirname, dist)
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    mode: 'production'
  };

  if (platform === 'node') {
    config.externals = {
      'lodash/get': 'commonjs lodash/get',
      'lodash/set': 'commonjs lodash/set'
    };
    config.optimization = {
      minimize: false
    };
    config.output.libraryTarget = 'commonjs';
  }

  return config;
};

const nodeConfig = getConfig(NODE_BUNDLE, 'node', 'lib');
const webConfig = getConfig(WEB_BUNDLE, 'web', 'dist');

module.exports = [nodeConfig, webConfig];
