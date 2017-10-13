'use strict'

module.exports = (app) => {
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_ACCESS_TOKEN !== undefined) {
    console.log('\n[ Access Tokens ]')

    const AccessToken = app.models.AccessToken

    var defaultToken = {
      id: process.env.DEV_ACCESS_TOKEN || new Date().getTime(),
      userId: 1
    }

    return (
      AccessToken.create(defaultToken).then((res) => {
        console.log('\n> [DEV_ACCESS_TOKEN] Adding AccessToken: %s', res.id)
      }).catch((err) => {
        console.error(err)
      })
    )
  }

  return (Promise.resolve(true))
}
