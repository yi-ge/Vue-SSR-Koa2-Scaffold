// 参考自 https://github.com/ccqgithub/koa-webpack-hot/blob/master/index.js
const hotMiddleware = require('webpack-hot-middleware')
const PassThrough = require('stream').PassThrough

module.exports = (compiler, opts = {}) => {
  opts.path = opts.path || '/__webpack_hmr'

  const middleware = hotMiddleware(compiler, opts)

  return async (ctx, next) => {
    if (ctx.request.path !== opts.path) {
      return next()
    }

    const stream = new PassThrough()
    ctx.body = stream

    middleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (status, headers) => {
        ctx.status = status
        Object.keys(headers).forEach(key => {
          ctx.set(key, headers[key])
        })
      },
      end: () => {
        stream.end()
      }
    }, next)
  }
}
