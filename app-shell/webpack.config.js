const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const { ModuleFederationPlugin } = require("@module-federation/enhanced/webpack");

module.exports = {
  entry: {
    app: "./src/index",
  },
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3001,
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
    splitChunks: {
      // chunks: "all",
      cacheGroups: {
        app: {
          name: "app",
          chunks: "all",
	        test: /[\\/]node_modules[\\/](?:react(?:-dom)?|scheduler)/,
	      },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    // new ExternalTemplateRemotesPlugin(),
    new ModuleFederationPlugin({
      name: "app-shell",
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
      shareStrategy: "loaded-first",
      remotes: {
        domain1: "domain1@http://localhost:3002/Domain1-RemoteEntry.js",
      },
      experiments: {
        federationRuntime: "hoisted",
        // provideExternalRuntime: true,
      },
    }),
  ],
};

