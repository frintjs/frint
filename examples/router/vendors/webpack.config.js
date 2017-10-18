const path = require('path');

module.exports = {
  entry: {
    vendor: path.resolve(__dirname, 'index.js')
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../build/js'),
    filename: 'vendors.js'
  }
};
