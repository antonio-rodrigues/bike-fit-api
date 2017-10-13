'use strict'
const path = require('path')
const fs = require('fs-extra')

const CONTAINER_PATH = path.join(__dirname, '../../../storage/')

module.exports = (app) => {
  if (process.env.INITDB || process.env.INITSTORAGE) {
    console.log('\n[ Storage ]')

    const Person = app.models.Person

    const checkContainer = (motardFolder) => {
      return new Promise((resolve, reject) => {
        fs.ensureDir(motardFolder, (err) => {
          if (err) reject(err)
        })
      })
    }

    /**
    * Create containers
    *   //storage
    *       /motard-email
    *           /files...
    */
    return (
      Person.find().then(persons => {
        persons.map(person => {
          if (person.email) {
            console.log('\n> Creating storage container for %s', person.email)

            let tenant = person.email // .replace(/\W+/g, '-') // replace non-alphanumeric
            let folderPath = path.join(CONTAINER_PATH, tenant)

            checkContainer(folderPath).then(value => value, reason => {
              console.error('\n> Error creating storage for person %s.\nError message: %s', tenant, reason)
            })
          }
        })
      })
    )
  }

  return (Promise.resolve(true))
}
