module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};

// var webpack = require('webpack');
// var externals = require('frint-config').externals;

// var minify = process.env.DIST_MIN;
// var plugins = !minify
//   ? []
//   : [
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false,
//         drop_console: false
//       },
//     }),
//   ];
// var filename = !minify
//   ? 'frint.js'
//   : 'frint.min.js';

// module.exports = {
//   entry: __dirname + '/src/index.ts',
//   output: {
//     path: __dirname + '/dist',
//     filename: filename,
//     libraryTarget: 'umd',
//     library: 'Frint',
//   },
//   externals: externals,
//   target: 'web',
//   plugins: plugins,
//   module: {
//     rules: [
//       // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
//       { test: /\.tsx?$/, loader: 'ts-loader' }
//     ]
//     // rules: [
//     //   {
//     //     test: /\.js$/,
//     //     exclude: /(node_modules)/,
//     //     loader: 'babel-loader',
//     //     query: {
//     //       presets: [
//     //         'travix'
//     //       ],
//     //     },
//     //   },
//     // ],
//   },
// };
