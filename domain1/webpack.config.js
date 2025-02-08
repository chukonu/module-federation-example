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
    // runtimeChunk setting
    // Findings 1) Federation runtime will still go into the 'remote entry'. 2)
    // setting it to 'single' will result in an error with
    // `__webpack_require__.X` not being a function.
    // X: startupEntryPoint
    // runtimeChunk: "single",
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

      // Compare the shorthand form and the object form:
      // shared: ["react", "react-dom"],
      // To be validated: if we want to reuse a dependency between two builds,
      // it seems we only need to use `loaded-first` strategy, without worrying
      // about `singleton`.
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

        // toggling this on will reduce the size of the 'remote entry' file by
        // a fixed amount, but break the main entry (runtimeCore.FederationHost
        // undefined).
        externalRuntime: false,
      },
    }),
  ],
};

