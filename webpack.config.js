const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const PnpPlugin = require("pnp-webpack-plugin");

const cssLoader = "css-loader";

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: () => [
        require('autoprefixer')()
      ]
    }
  }
};

module.exports = function(env, { runTest }) {
  const production = env === 'production' || process.env.NODE_ENV === 'production';
  const test = env === 'test' || process.env.NODE_ENV === 'test';
  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-maps' : 'inline-source-map',
    entry: test ? './test/all-spec.js' :  './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'entry-bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      plugins: [PnpPlugin]
    },
    resolveLoader: {
      plugins: [PnpPlugin.moduleLoader(module)],
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000,
      lazy: false
    },
    module: {
      rules: [
        { test: /\.css$/i, issuer: /\.(js|ts)$/, use: [ "style-loader", cssLoader, postcssLoader ] },
        { test: /\.css$/i, issuer: /\.html$/, use: [ "to-string-loader", cssLoader, postcssLoader ] },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        {
          test: /\.html$/i,
          use: {
            loader: '@aurelia/webpack-loader'
          },
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.ejs' }),
      test && runTest && new WebpackShellPluginNext({
        dev: false,
        swallowError: true,
        onBuildEnd: {
          scripts: [ 'npm run test:headless' ]
        }
      })
    ].filter(p => p)
  }
}
