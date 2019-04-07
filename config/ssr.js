const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const LRU = require('lru-cache')
const {
  createBundleRenderer
} = require('vue-server-renderer')
const isProd = process.env.NODE_ENV === 'production'
const setUpDevServer = require('./setup-dev-server')
const HtmlMinifier = require('html-minifier').minify

const pathResolve = file => path.resolve(__dirname, file)

module.exports = app => {
  return new Promise((resolve, reject) => {
    const createRenderer = (bundle, options) => {
      return createBundleRenderer(bundle, Object.assign(options, {
        cache: new LRU({
          max: 1000,
          maxAge: 1000 * 60 * 15
        }),
        basedir: pathResolve('../dist/web'),
        runInNewContext: false
      }))
    }

    let renderer = null
    if (isProd) {
      // prod mode
      const template = HtmlMinifier(fs.readFileSync(pathResolve('../public/index.html'), 'utf-8'), {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: false
      })
      const bundle = require(pathResolve('../dist/web/vue-ssr-server-bundle.json'))
      const clientManifest = require(pathResolve('../dist/web/vue-ssr-client-manifest.json'))
      renderer = createRenderer(bundle, {
        template,
        clientManifest
      })
    } else {
      // dev mode
      setUpDevServer(app, (bundle, options, apiMain, apiOutDir) => {
        try {
          const API = eval(apiMain).default // eslint-disable-line
          const server = API(app)
          renderer = createRenderer(bundle, options)
          resolve(server)
        } catch (e) {
          console.log(chalk.red('\nServer error'), e)
        }
      })
    }

    app.use(async (ctx, next) => {
      if (!renderer) {
        ctx.type = 'html'
        ctx.body = 'waiting for compilation... refresh in a moment.'
        next()
        return
      }

      let status = 200
      let html = null
      const context = {
        url: ctx.url,
        title: 'OK'
      }

      if (/^\/api/.test(ctx.url)) { // 如果请求以/api开头，则进入api部分进行处理。
        next()
        return
      }

      try {
        status = 200
        html = await renderer.renderToString(context)
      } catch (e) {
        if (e.message === '404') {
          status = 404
          html = '404 | Not Found'
        } else {
          status = 500
          // console.log(e)
          console.log(chalk.red('\nError: '), e.message)
          html = '500 | Internal Server Error'
        }
      }
      ctx.type = 'html'
      ctx.status = status || ctx.status
      ctx.body = html
      next()
    })

    if (isProd) {
      const API = require('../dist/api/api').default
      const server = API(app)
      resolve(server)
    }
  })
}
