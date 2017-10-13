'use strict'

module.exports = function (app) {
  const Metadata = app.models.Metadata

  const metadata = {
    'monthsabrv': {
      'default': '1',
      'JAN': {
        'key': '1',
        'fr': 'Janv',
        'en': 'Jan'
      },
      'FEB': {
        'key': '2',
        'fr': 'Févr',
        'en': 'Feb'
      },
      'MAR': {
        'key': '3',
        'fr': 'Mars',
        'en': 'Mar'
      },
      'APR': {
        'key': '4',
        'fr': 'Avril',
        'en': 'Apr'
      },
      'MAY': {
        'key': '5',
        'fr': 'Mai',
        'en': 'May'
      },
      'JUN': {
        'key': '6',
        'fr': 'Juin',
        'en': 'Jun'
      },
      'JUL': {
        'key': '7',
        'fr': 'Juil',
        'en': 'Jul'
      },
      'AUG': {
        'key': '8',
        'fr': 'Août',
        'en': 'Aug'
      },
      'SEP': {
        'key': '9',
        'fr': 'Sept',
        'en': 'Sep'
      },
      'OCT': {
        'key': '10',
        'fr': 'Oct',
        'en': 'Oct'
      },
      'NOV': {
        'key': '11',
        'fr': 'Nov',
        'en': 'Nov'
      },
      'DEC': {
        'key': '12',
        'fr': 'Déc',
        'en': 'Dec'
      }
    }
  }

  // Metadata.keys = metadata

  if (process.env.INITDB || process.env.INITMETADATA) {
    console.log('\n[ Metadata ]')

    Metadata.destroyAll((err, res) => {
      if (err) {
        console.log('\n Metadata error on flushing ', err)
        return err
      } else {
        return (Metadata.create(metadata))
      }
    })
  }

  return (Promise.resolve(true))
}
