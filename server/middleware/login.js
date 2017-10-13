'use strict'
const loopback = require('loopback')
const LoopBackContext = require('loopback-context')

/**
 * Middleware for adding the login info to the request with the user roles
 */

module.exports = (app) => {
  if (app) {
    app.use('/api', LoopBackContext.getCurrentContext())
    app.use('/api', loopback.token(/*{
      model: app.models.accessToken,
      currentUserLiteral: 'person',
      searchDefaultTokenKeys: false,
      cookies: ['access_token'],
      headers: ['access_token', 'X-Access-Token'],
      params: ['access_token']
    }*/))

    return (req, res, next) => {
      if (req.accessToken && req.accessToken.userId) {
        app.models.Person.getLoginInfo(req.accessToken.userId).then((login) => {
          req.login = login
          // console.log(`Middleware: login :  ${JSON.stringify(req.login)}`)
          next()
        }).catch((e) => {
          next(e)
        })
      } else {
        next()
      }
    }
  }
}
