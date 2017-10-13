'use strict'

module.exports = (app) => {
  if (process.env.INITDB) {
    console.log('\n[ Flushing database... ]')

    // delete by Id
    app.models.ACL.find((err, row) => {
      if (err) throw (new Error(err))
      if (row && row.length) {
        row.map((r) => {
          app.models.ACL.destroyById(r.id, (err) => {
            if (err) {
              throw (new Error('Destroy ACL model error:\n' + err))
            }
          })
        })
      }
    })

    const models = [
      'ACL',
      'Role',
      'RoleMapping',
      'AccessToken',
      'Person',
      'Metadata',
      'FuelLog',
      'BikeType',
      'BikeData',
      'Service'
    ]

    return (Promise.all(
      models.map((name) => {
        if (name) {
          let model = app.models[name]
          if (model) {
            console.log('\n> Destroy model: ' + name)
            return (
              model.destroyAll((err, info) => {
                if (err) {
                  console.error('\n> Destroy model error: ', err)
                }
              })
            )
          }
          console.warn('> Destroy model - invalid model: ' + name)
          return (true)
        }
        console.warn('> Destroy model - invalid model data')
        return (true)
      }
    )))
  }
}
