const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: path.resolve(__dirname, 'index.js')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress:false,
        port: 3000,
  },
  module: {
    rules: [
        { test: /\.(glsl|vs|fs|vert|frag)$/, exclude: /node_modules/, use: [ 'raw-loader' ]},
        {

          test: /\.(png|svg|jpg|jpeg|gif)$/i,
  
          type: 'asset/resource',
  
        },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'WebGL Project Boilerplate',
        template: path.resolve(__dirname, 'webgl.html'),
        inject: 'body'
    })
],
};