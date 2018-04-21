const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: ['babel-polyfill', path.join(__dirname, 'src/index.jsx')],
  },
  devServer: {
    contentBase: path.join(__dirname, 'src/public'),
    historyApiFallback: true,
    disableHostCheck: true,
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8000,
  },
  output: {
    path: path.resolve('build'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/public/index.html',
      filename: 'index.html',
      inject: false,
    }),
    new ExtractTextPlugin('[name].[hash:8].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ENDPOINT: JSON.stringify(process.env.ENDPOINT || 'http://localhost:9000'),
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
            ['env', { targets: { browsers: ['last 2 versions'] }, modules: false }],
            'stage-2',
          ],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
      },
    ],
  },
};
