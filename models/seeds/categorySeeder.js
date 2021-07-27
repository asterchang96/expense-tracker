const mongoose = require('mongoose')
const Category = require('../category')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')

  Category.create({ category: "食", incomeOrExpenses: "支出"})
  Category.create({ category: "衣", incomeOrExpenses: "支出"})
  Category.create({ category: "住", incomeOrExpenses: "支出"})
  Category.create({ category: "行", incomeOrExpenses: "支出"})
  Category.create({ category: "育", incomeOrExpenses: "支出"})
  Category.create({ category: "樂", incomeOrExpenses: "支出"})
  Category.create({ category: "薪水", incomeOrExpenses: "收入"})
  Category.create({ category: "零用錢", incomeOrExpenses: "收入"})
  
  console.log('category done')
})