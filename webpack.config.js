const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction
        ? 'shopify-headless-app.min.js'
        : 'shopify-headless-app.js',
      library: 'ShopifyHeadlessApp',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true,
    },
    mode: argv.mode || 'production',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    plugins: [
      new Dotenv({
        systemvars: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              cacheDirectory: true,
            },
          },
        },
      ],
    },
    optimization: isProduction
      ? {
          minimize: true,
          sideEffects: false,
        }
      : {},
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      port: 8080,
      hot: true,
      open: true,
    },
  };
};
