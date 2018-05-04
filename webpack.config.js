const path = require('path')

module.exports = {
  entry: './src/from-html.js',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  output: {
    filename: 'from-html.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'fromHTML',
    libraryTarget: 'umd'
  },
  mode: 'production'
}
