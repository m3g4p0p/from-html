const path = require('path')

module.exports = {
  entry: './src/from-html.js',
  output: {
    filename: 'from-html.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'fromHTML',
    libraryTarget: 'umd'
  },
  mode: 'production'
}
