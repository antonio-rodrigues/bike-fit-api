'use strict'

module.exports = function (app) {
  if (process.env.INITDB || process.env.INITGE) {
    console.log('\n[ Init: General]')

    // const Trade = app.models.Trade

    // return (Promise.all([

    //   Project.create({
    //     id: 'general', status: 'OPEN', projectType: 'GEN', companyId: 'bau-box', endDate: '2018-10-24', startDate: '2016-10-24', personId: 'leonardo@bau-box.ch'
    //   })

    // ]))
  }

  return (Promise.resolve(true))
}
