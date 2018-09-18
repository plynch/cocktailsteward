var HTMLWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var path = require('path')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports ={
  entry: [
    './app/index.jsx',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=app/fonts/[name].[ext]'
      }
    ]
  },

  plugins: [
    HTMLWebpackPluginConfig,
    new webpack.LoaderOptionsPlugin({
    options: {
      context: path.join(__dirname, 'src'),
      output: {
        path: path.join(__dirname, 'www')
      }
    }
  })]
}
