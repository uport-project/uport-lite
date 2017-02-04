var path = require('path')

const libraryName = 'uport-lite'
const outputFile = libraryName + '.js'

module.exports = {
  entry: './src/index.js',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library: 'UportLite',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
}
