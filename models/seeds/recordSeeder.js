const db = require('../../config/mongoose')

const Record = require('../record')
const { recordSeeders } = require('./seeds.json')

db.once('open', () => {
  Record.create(recordSeeders)
    .then(() => {
      console.log("record done")
      return db.close()
    })
    .catch(err => console.error(err))
})