const path = require('path')

module.exports = {
  entry: './lib/from-html.js',
  output: {
    filename: 'from-html.umd.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'fromHTML',
    libraryTarget: 'umd'
  },
  mode: 'production'
}
