'use strict'

const path = require('path')
const loopback = require('loopback')
const LoopBackContext = require('loopback-context')
const boot = require('loopback-boot')
const socket = require('socket.io')

const https = require('https')
const http = require('http')
const sslConfig = require('./ssl-config')

const getColorizedBootVars = (parm, value) => {
  // https://stackoverflow.com/a/41407246
  if (value) {
    console.log(`\x1b[33m{ ${parm}: ${value} }\x1b[0m`)
  } else {
    console.log(`{ ${parm}: ${value} }`)
  }
}

// let options = {
//   key: sslConfig.privateKey,
//   cert: sslConfig.certificate
// }

const EventEmitter = require('events')
require('events').EventEmitter.prototype._maxListeners = 100

const app = module.exports = loopback()

app.use(LoopBackContext.perRequest())
app.use(loopback.token())
// app.use(function setCurrentUser (req, res, next) {
//   if (!req.accessToken) {
//     return next()
//   }
//   app.models.Person.findById(req.accessToken.userId, (err, user) => {
//     console.info(`> USER.DATA: ${JSON.stringify(user)}`)
//     if (err) {
//       return next(err)
//     }
//     if (!user) {
//       return next(new Error('> No user with this access token was found.'))
//     }
//     var loopbackContext = LoopBackContext.getCurrentContext()
//     if (loopbackContext) {
//       loopbackContext.set('currentUser', user)
//     }
//     next()
//   })
// })

app.start = (httpOnly) => {
  let server = null
  if (httpOnly !== undefined) {
    const options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate
    }
    server = https.createServer(options, app)
  } else {
    // console.log({httpOnly: httpOnly || true})
    httpOnly = process.env.HTTP
    server = http.createServer(app)
  }

  server.listen(app.get('port'), () => {
    let baseUrl = (httpOnly === undefined ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port')
    app.emit('started', baseUrl)

    console.info(`\n==> 🌎  LoopBack server listening @ ${baseUrl}`)

    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath
      console.info(`==> 🔷  API Explorer available @ ${baseUrl}${explorerPath}`)
    } else {
      console.info(`==> ⭕  API Explorer unavailable`)
    }
  })
  return server
}

app.dataSource('storage', {
  'name': 'storage',
  'connector': 'loopback-component-storage',
  'provider': 'filesystem',
  'root': path.join(__dirname, '../storage')
})

// Add Readonly Mixin to loopback
require('loopback-ds-paginate-mixin')(app)

app.use(loopback.static(path.resolve(__dirname, '../client')))
app.use(loopback.static(path.resolve(__dirname, '../assets')))

// app.use('/api', require('./middleware/login')(app))
app.use('/api', loopback.rest())

// PLEASE : do no comment these lines - browser refresh do not work anymore without it
if (process.env.NODE_ENV && !(process.env.SHOW_EXPLORER)) {
  app.all('/*', function (req, res, next) {
    // console.log({ req: req }, 'start request')
    res.sendFile(path.resolve('client/index.html'))
  })
}

// app add-ons
// require('./addon/I18n')(app)
// require('./addon/cron')(app)
// require('./addon/push-notifications')(app)

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err

  console.log('\n--------------------------------')
  console.group('APP ENV PARAMETERS:')
  getColorizedBootVars('NODE_ENV', process.env.NODE_ENV)
  getColorizedBootVars('INITDB', process.env.INITDB)
  getColorizedBootVars('INIUSERS', process.env.INIUSERS)
  getColorizedBootVars('INITMETADATA', process.env.INITMETADATA)
  getColorizedBootVars('INITBIKES', process.env.INITBIKES)
  getColorizedBootVars('INISTORAGE', process.env.INISTORAGE)
  getColorizedBootVars('DEV_ACCESS_TOKEN', process.env.DEV_ACCESS_TOKEN)
  getColorizedBootVars('SHOW_EXPLORER', process.env.SHOW_EXPLORER)
  console.groupEnd()
  console.log('\n---------------------------------')

  // start the server if `$ node server.js`
  if (require.main === module) {
    console.log('Server starting...')
    console.log('---------------------------------')
    app.io = socket(app.start(), {
      transports: ['websocket'],
      path: '/socket',
      jsonp: false
    })
  }
})
