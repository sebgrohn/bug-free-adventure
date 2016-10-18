'use strict';

const webpackConfig = {
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    filename: './main.js',
    pathinfo: true,
    libraryTarget: 'commonjs2',
  },

  target: 'node',
  devtool: 'source-map',

  node: {
    console: true,
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  resolve: {
    extensions: ['', '.js'],
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'es2016', 'es2017'],
          cacheDirectory: true,
        },
      },
    ],
  },
};
module.exports = webpackConfig;
