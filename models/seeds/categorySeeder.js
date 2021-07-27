const mongoose = require('mongoose')
const Category = require('../category')
const { categorySeeders } = require('./seeds.json')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  
  Category.create(categorySeeders)
    .then(() => {
      console.log("category done")
      return db.close()
    })
    .catch(err => console.error(err))
})