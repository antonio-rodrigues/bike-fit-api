'use strict'

module.exports = function (app) {
  if (process.env.INITDB || process.env.INITBIKES) {
    console.group('\n[ Init: Types and Bikes ]')

    const BikeType = app.models.BikeType
    const BikeData = app.models.BikeData
    const Service = app.models.Service

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
        bikeTypes: loadFile('../data/bike-type.json'),
        bikeData: loadFile('../data/bike-data.json'),
        bikeService: loadFile('../data/bike-service.json')
      }
    }

    const { bikeTypes, bikeData, bikeService } = loadAllFiles()

    if (process.env.INITBIKES !== undefined) {
      BikeType.destroyAll()
      BikeData.destroyAll()
      Service.destroyAll()
    }

    return (
      Promise.all([
        BikeType.create(bikeTypes),
        BikeData.create(bikeData),
        Service.create(bikeService)
      ])
      .then(results => {
        if (results && results.length) {
          console.info(`> Created: ${results[0].length} bikes, ${results[1].length} bike types, ${results[2].length} service logs`)
        } else {
          console.warn(`> No services created!`)
        }
      })
      .catch(reason => console.error(reason))
    )
  }

  console.groupEnd()
  return (Promise.resolve(true))
}
