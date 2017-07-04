module.exports = {
  entry: {
    vendor: __dirname + '/index.js'
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/../build/js',
    filename: 'vendors.js'
  }
};
