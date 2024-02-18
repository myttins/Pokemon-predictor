const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },
  devServer: {
    static: {
      publicPath: '/build',
      directory: path.resolve(__dirname, './build'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
      '/public': {
        target: 'http://localhost:3000',
      },
    },
    host: 'localhost',
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules\/(?!(react-avatar-editor)\/).*/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      publicPath: '/',
    }),
  ],
  resolve: {
    // Enable importing JS / JSX files without specifying their extension
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
  },
};
