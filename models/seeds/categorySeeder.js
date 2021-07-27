const mongoose = require('mongoose')
const Category = require('../category')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')

  Category.create({ category: "食"})
  Category.create({ category: "衣"})
  Category.create({ category: "住"})
  Category.create({ category: "行"})
  Category.create({ category: "育"})
  Category.create({ category: "樂"})
  
  console.log('category done')
})