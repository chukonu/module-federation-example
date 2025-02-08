const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const { ModuleFederationPlugin } = require("@module-federation/enhanced/webpack");

const cacheGroups = () => ({
  // The cache-group key is like a prefix. To capture all matching modules in
  // one file, set `name` of the cache-group as well.
  commons: {
    name: "commons-react",
    chunks: "all",
    test: /[\\/]node_modules[\\/](?:react(?:-dom)?|scheduler)/,
  },
});

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
      cacheGroups: cacheGroups(),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
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
        provideExternalRuntime: true,
      },
    }),

    // Does not seem to work with the enhanced version.
    // Consider cache control on the remote entry.
    // new ExternalTemplateRemotesPlugin(),
  ],
};

