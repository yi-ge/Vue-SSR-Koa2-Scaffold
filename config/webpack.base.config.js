const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    publicPath: '/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].js'
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/web'),
      '~': path.join(__dirname, '../src/api'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, '../src/web')],
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            'transform-vue-jsx',
            '@babel/plugin-syntax-jsx',
            '@babel/plugin-syntax-dynamic-import'
          ]
        }
      }
    },
    // {
    //   test: /\.(js|jsx|vue)$/,
    //   enforce: 'pre',
    //   exclude: /node_modules/,
    //   use: {
    //     loader: 'eslint-loader'
    //   }
    // },
    {
      test: /\.json$/,
      use: 'json-loader'
    },
    {
      test: /\.pug$/,
      use: {
        loader: 'pug-plain-loader'
      }
    },
    {
      test: /\.css$/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        'css-loader'
      ]
    },
    // {
    //   test: /\.styl(us)?$/,
    //   use: [
    //     isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    //     'css-loader',
    //     'stylus-loader'
    //   ]
    // },
    // {
    //   test: /\.less$/,
    //   use: [
    //     isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    //     'css-loader',
    //     'less-loader'
    //   ]
    // },
    {
      test: /\.html$/,
      use: 'vue-html-loader',
      exclude: /node_modules/
    },
    {
      test: /\.vue$/,
      use: [
        {
          loader: 'vue-loader',
          options: {
            preserveWhitespace: false
          }
        }
      ]
    },
    {
      test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
      use: {
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'assets/images/[name].[hash:8].[ext]'
        }
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'assets/images/[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: {
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'assets/font/[name].[hash:8].[ext]'
        }
      }
    }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3
      // cacheGroups: {
      //   commons: {
      //     name: 'manifest',
      //     chunks: 'initial',
      //     minChunks: 2
      //   }
      // }
    }
  },
  performance: {
    maxEntrypointSize: 400000,
    hints: isProd ? 'warning' : false
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../public'),
      to: path.join(__dirname, '../dist/web'),
      ignore: ['.*', 'index.html']
    }]),
    new FriendlyErrorsPlugin(),
    new VueLoaderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 15
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css'
    })
  ]
}
