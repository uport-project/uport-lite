var path = require('path')

const libraryName = 'uportlite'
const outputFile = libraryName + '.js'

module.exports = {
  entry: './src/index.js',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
}
