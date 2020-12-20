const path = require("path");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
require("babel-polyfill");

function createConfig(env) {
  const config = {
    entry: ["babel-polyfill", path.resolve(__dirname, "src", "index.jsx")],
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: path.resolve(__dirname, "node_modules"),
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-syntax-dynamic-import",
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                ["babel-plugin-styled-components"],
              ],
            },
          },
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
      ],
    },
    plugins: [],
  };

  if (env.development) {
    config.plugins.push(
      new BrowserSyncPlugin({
        // use existing Apache virtual host
        proxy: "http://localhost/backendProject/",
        port: 9000,
        // tunnel: true,
        // watch the built files and the index file
        files: ["client/build/*", "index.php"],
        notify: false,
      })
    );
  }

  if (env.production) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
          sequences: true,
          conditionals: true,
          booleans: true,
          if_return: true,
          join_vars: true,
          drop_console: true,
        },
        output: {
          comments: false,
        },
        minimize: true,
      })
    );
  }

  return config;
}

module.exports = (env) => createConfig(env);
