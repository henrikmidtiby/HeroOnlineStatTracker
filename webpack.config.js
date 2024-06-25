const path = require('path');

module.exports = {
  entry: {
    webpack_bundle: ['./components/hero-stats.js', 
                     './node_modules/socket.io-client/dist/socket.io.js'], 
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [
  ],
}
