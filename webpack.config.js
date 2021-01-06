const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    script: './src/js/script.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js'),
  },
}
