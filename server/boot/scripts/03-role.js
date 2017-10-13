'use strict'

module.exports = (app) => {
  /*
   * Register dynamic roles
   */

  if (process.env.INITDB || process.env.INITUSERS) {
    console.log('\n[ Roles ]')

    // const Role = app.models.Role
    // const Person = app.models.Person

    // Role.registerResolver('$member', (role, context, cb) => {
    //   var userId = context.accessToken.userId
    //   if (!userId) {
    //     return cb(null, false) // do not allow anonymous users
    //   }

    //   switch (context.modelName) {
    //     case 'company':
    //       return authorizeCompany(context, cb)
    //     default:
    //       return cb(null, false) // unhandled target
    //   }
    // })

    // function authorizeCompany (context, cb) {
    //   if (context.property === '__get__projects') {
    //     Person.findById(context.accessToken.userId, (err, user) => {
    //       if (err || !user) {
    //         console.error(err)
    //         return cb(err, false)
    //       }

    //       return cb(null, '' + user.companyId === '' + context.modelId)
    //     })
    //   } else {
    //     return cb(null, false)
    //   }
    // }

    return (Promise.resolve(true))
  }
}
