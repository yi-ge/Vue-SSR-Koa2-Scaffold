const path = require('path')
const Koa = require('koa')
const koaCompress = require('koa-compress')
const compressible = require('compressible')
const koaStatic = require('./koa/static')
const SSR = require('./ssr')
const conf = require('./app')

const isProd = process.env.NODE_ENV === 'production'

const app = new Koa()

app.use(koaCompress({ // 压缩数据
  filter: type => !(/event\-stream/i.test(type)) && compressible(type) // eslint-disable-line
}))

app.use(koaStatic(isProd ? path.resolve(__dirname, '../dist/web') : path.resolve(__dirname, '../public'), {
  maxAge: 30 * 24 * 60 * 60 * 1000
})) // 配置静态资源目录及过期时间

// vue ssr处理，在SSR中处理API
SSR(app).then(server => {
  server.listen(conf.app.port, '0.0.0.0', () => {
    console.log(`> server is staring...`)
  })
})
