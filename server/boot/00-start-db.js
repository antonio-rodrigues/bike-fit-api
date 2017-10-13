'use strict'

module.exports = (app) => {
  console.group('\n>>>>>> API BOOTSTRAP: BEGIN >>>>>>')

  const scripts = [
    require('./scripts/flush-database.js'),
    require('./scripts/00-acl.js'),
    require('./scripts/01-load-users.js'),
    require('./scripts/02-access-token.js'),
    require('./scripts/03-role.js'),
    require('./scripts/04-init-metadata.js'),
    require('./scripts/07-init-bike.js'),
    require('./scripts/08-init-storage.js'),
    require('./scripts/09-init-general.js')
  ]

  const runScripts = () => {
    let result = Promise.resolve()
    scripts.forEach((script) => {
      result = result.then(() => script(app)).catch((e) => { console.error('> Error on boot script', e) })
    })
    return (result)
  }

  runScripts(scripts).then(() => {
    console.log('\n---------------------------------')
    console.groupEnd()
    console.log('\n>>>>>> API BOOTSTRAP: END >>>>>>\n')
  })
}
