const mongoose = require('mongoose')
const Record = require('../record')
const { recordSeeders } = require('./seeds.json')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection


db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')

  //加入seeders
  Record.create(recordSeeders)
    .then(() => {
      console.log("record done")
      return db.close()
    })
    .catch(err => console.error(err))
})