const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevBuild = env && env.dev;

  // Determine filename based on build type
  let filename;
  if (isProduction) {
    filename = 'shopify-headless-app.min.js';
  } else if (isDevBuild) {
    filename = 'shopify-headless-app.dev.js';
  } else {
    filename = 'shopify-headless-app.js';
  }

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename,
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
        // Override cache TTL for dev builds
        defaults: isDevBuild ? { CACHE_TTL: '0' } : undefined,
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
