const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model

let categoryIncome = null
let categoryExpense = null
//區分收入/支出，對應category
function getCategory(){
  Category.find()
    .lean()
    .then((categories) => {
      console.log(categories)
      categoryIncome = categories.filter((element) => {
        if (element.incomeOrExpenses === '收入')  return element.category

      })
      categoryExpense = categories.filter((element) => {
        if (element.incomeOrExpenses === '支出') return element.category
      })
    })
}

router.get('/', async (req, res) => {
  let totalAmount = 0
  const categories = await Category.find().lean()
  return Record.find()
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      records.forEach((record) => {
        if(record.incomeOrExpenses === '收入') totalAmount += record.amount
        else totalAmount -= record.amount
      })
      res.render('index', { records, categories, totalAmount })
    })
    .catch((error) => {
      console.log(error)
    })
})

module.exports = router