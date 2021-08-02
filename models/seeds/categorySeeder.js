const db = require('../../config/mongoose')

const Category = require('../category')
const { categorySeeders } = require('./seeds.json')

db.once('open', () => {
  Category.create(
    categorySeeders
    ).then(() => {
      console.log("category done")
      return db.close()
    })
    .then(() => {
      console.log("record database done")
    })
})

