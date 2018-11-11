const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config')
const isProd = process.env.NODE_ENV === 'production'
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const version = ' V ' + require('../package.json').version

console.log(version)

module.exports = merge(base, {
  name: 'web',
  devtool: '#eval-source-map',
  entry: {
    app: path.resolve(__dirname, '../src/web/entry-client.js')
  },
  mode: isProd ? 'production' : 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"',
      'process.env.BM_VERSION': "'" + version + "'"
    }),
    new VueSSRClientPlugin()
  ]
})
