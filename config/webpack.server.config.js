const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const config = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const version = ' V ' + require('../package.json').version

module.exports = merge(config, {
  name: 'server',
  target: 'node',
  devtool: '#cheap-module-source-map',
  mode: 'production',
  entry: path.join(__dirname, '../src/web/entry-server.js'),
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: [/\.vue$/, /\.css$/, /\.styl(us)$/, /\.pug$/]
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"',
      'process.env.BM_VERSION': "'" + version + "'"
    }),
    new VueSSRServerPlugin()
  ]
})
