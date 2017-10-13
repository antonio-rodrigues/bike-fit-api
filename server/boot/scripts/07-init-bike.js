'use strict'

module.exports = function (app) {
  if (process.env.INITDB || process.env.INITBIKES) {
    console.log('\n[ Init: Types and Bikes ]')

    const BikeType = app.models.BikeType
    const BikeData = app.models.BikeData

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

    const bikeTypes = loadFile('../data/bike-type.json')
    const bikeData = loadFile('../data/bike-data.json')

    return (
      Promise.all([
        BikeType.create(bikeTypes),
        BikeData.create(bikeData)
      ])
      .then(results => {
        if (results && results.length) {
          console.log('RESULTS:', results)
          console.info(`> Created ${results.length} bikes`)
        }
      })
      .catch(reason => console.error(reason))
    )
  }

  return (Promise.resolve(true))
}
