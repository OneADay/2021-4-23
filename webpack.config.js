const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
  context: __dirname,
  entry: './src/scripts/index.ts',
  devServer: {
    https: true,
    port: 9000,
    host: 'localhost',
    historyApiFallback: true,
    contentBase: '/',
    writeToDisk: true
  },
  mode: 'development',
  devtool: "source-map",
  module: {
      rules: [
        {
          test: /\.txt$/i,
          use: [{
            loader: 'raw-loader'
          }]
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              interpolate: true
            }
          }],
          exclude: /node_modules/
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [{
              loader: 'style-loader'
          }, {
              loader: 'css-loader',
              options: { 
                sourceMap: true, 
                importLoaders: 1 
              }
          }, {
              loader: 'postcss-loader'
          }]
        },
        {
          test: /\.less$/,
          use: [{
              loader: 'style-loader'
          }, {
              loader: 'css-loader',
              options: { 
                sourceMap: true, 
                importLoaders: 1,
                modules: true
              }
          }, {
              loader: 'postcss-loader',
              options: { 
                sourceMap: true
              }
          }, {
              loader: 'less-loader',
              options: { 
                sourceMap: true,
              }
          }, {
            loader: 'typed-css-modules-loader'
          }] 
        }
      ],
  },
  resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        src: path.resolve(__dirname, './src/'),
        assets: path.resolve(__dirname, './src/assets/'),
        scripts: path.resolve(__dirname, './src/scripts/'),
      }
  },
  output: {
      filename: 'main.min.js',
      path: path.resolve(__dirname, 'dist')
  }
}

module.exports = environment => {

  config.plugins = [
    new HtmlWebpackPlugin({
      title: `OneADay_${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
      template: path.resolve(__dirname, 'src', 'index.ejs')
    }),
    new CopyWebpackPlugin({patterns: [
      {
        from: 'src/assets',
        to: 'assets',
        noErrorOnMissing: true
      },
      {
        from: 'src/libs',
        to: 'libs',
        noErrorOnMissing: true
      },
      {
        from: 'output/render.gif',
        to: 'thumbnail.gif',
        noErrorOnMissing: true
      }
    ]})
  ];
  
  return config;
}