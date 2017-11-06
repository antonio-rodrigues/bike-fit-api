'use strict'

module.exports = function (app) {
  if (process.env.INITDB || process.env.INITINSURERS) {
    console.group('\n[ Init: Insurers ]')

    const Insurers = app.models.Insurers

    const loadFile = (file) => {
      try {
        const data = require(file)
        if (data) {
          console.log(`> Loaded file ${file}`)
          return (data)
        }
      } catch (exception) {
        console.warn(`! Error loading file ${file}`, exception)
      }
      return (false)
    }

    const loadAllFiles = () => {
      return {
        insurerCompanies: loadFile('../data/bike-insurers.json')
      }
    }

    const { insurerCompanies } = loadAllFiles()

    if (process.env.INITINSURERS !== undefined) {
      Insurers.destroyAll()
    }

    return (
      Promise.all([
        Insurers.create(insurerCompanies)
      ])
      .then(results => {
        if (results && results.length) {
          console.info(`> Created: ${results[0].length} insurers`)
        } else {
          console.warn(`> No insurers created!`)
        }
      })
      .catch(reason => console.error(reason))
    )
  }

  console.groupEnd()
  return (Promise.resolve(true))
}
