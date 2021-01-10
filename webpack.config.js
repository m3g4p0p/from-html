
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { resolve, join } = require('path')

const path = {
  src: resolve(__dirname, 'src'),
  dist: resolve(__dirname, 'lib')
}

module.exports = ({ production = false } = {}) => ({
  entry: join(path.src, 'from-html.js'),
  plugins: [
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'standard-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  mode: production ? 'production' : 'development',
  devtool: production ? false : 'inline-source-map',
  output: {
    path: path.dist,
    filename: 'from-html.js',
    library: 'fromHTML',
    libraryTarget: 'umd'
  }
})
