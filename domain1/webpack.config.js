const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("@module-federation/enhanced/webpack");

module.exports = {

  // What if we use an object to define the entry?
  // It will not work. The code in index that renders in the root will be
  // called from remote entry.
  entry: "./src/index",

  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
      watch: true,
    },
    port: 3002,
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
        options: {
          target: "es2020",
          loader: "jsx",
        },
      },
    ],
  },
  optimization: {
    // Federation runtime still goes into the 'remote entry'.
    runtimeChunk: "single",
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new ModuleFederationPlugin({
      name: "domain1",
      filename: "Domain1-RemoteEntry.js",
      exposes: {
        "./Domain1": "./src/Domain1.js",
      },
      // Is it a bug that you have to set this both in app shell and domain 1?
      shareStrategy: "loaded-first",
      shared: {
        react: {
          singleton: true,

          // Setting it manually as it seems not in sync with package.json
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
      },
      experiments: {
        // startup chunk, async loading
        federationRuntime: "hoisted",

        // externalRuntime: true,
      },
    }),
  ],
};

