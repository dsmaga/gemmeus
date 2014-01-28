var start = Date.now()
  , fs = require('fs')
  , config = require('./config/app')
  , isUnixSocket = typeof config.port === 'string'
  , koa = require('koa')
  , logger = require('koa-logger')
  , router = require('koa-trie-router')
  , parse = require('co-body')
  , conditional = require('koa-conditional-get')
  , etag = require('koa-etag')
  , serve = require('koa-static')
  , app = module.exports = koa()
  , render = require('./lib/render')

// Delete the socket file if it exists (from a previous run)
if (isUnixSocket && fs.existsSync(config.port)) {
  fs.unlinkSync(config.port)
}

app.use(serve('public'))
   .use(logger())
   .use(conditional())
   .use(etag())
   .use(function *bodyParser(next) {
      if (this.is('json')) {
        try {
          this.req.body = yield parse.json(this)
          yield next
        }
        catch (e) {
          this.status = e.status
        }
      }
      else {
        yield next
      }
    })
   .use(router(app))

// Routes

app.get('/', function *() {
  this.body = yield render('game')
})

// Listen
if (!module.parent) {
  app.listen(config.port, function() {
    var time = Date.now() - start
      , portStr = isUnixSocket ? 'socket' : 'port'

    if (isUnixSocket && fs.existsSync(config.port)) {
      fs.chmodSync(config.port, '777')
    }
    console.log([ config.appName
                , 'started on'
                , portStr
                , config.port
                , '('
                , config.env
                , ') in'
                , time
                , 'ms'
                ].join(' '))
  })
}
