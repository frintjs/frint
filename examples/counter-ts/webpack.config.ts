import { join } from "path";
import * as webpack from "webpack";

const config: webpack.Configuration = {
  devServer: {
    compress: true,
    contentBase: join(__dirname, "."),
    port: 9000,
  },
  devtool: "source-map",
  entry: "./core/index.ts",
  module: {
    loaders: [
      // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
    ],
  },
  output: {
    filename: "bundle.js",
    path: join(__dirname, "build"),
  },
  // Enable sourcemaps for debugging webpack"s output.
  resolve: {
    // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
  },
};

export default config;
