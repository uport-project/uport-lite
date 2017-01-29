var path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'uport-lite.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'this',
    library: 'UportLite'
  }
}
