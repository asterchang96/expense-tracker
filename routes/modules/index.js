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
      categoryIncome = categories.filter((e) => (e.incomeOrExpenses === '收入'))
      categoryExpense = categories.filter((e) => (e.incomeOrExpenses === '支出'))
    })
}



router.get('/', async(req, res) => {
  getCategory()
  let totalAmount = 0
  const categories = await Category.find().lean()
  const userId = req.user._id
  return Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      records.forEach((record) => {
        if(record.incomeOrExpenses === '收入') totalAmount += record.amount
        else totalAmount -= record.amount
        
        record.iconClass = (categories.find(category => (category.category === record.category))).iconClass
      })
      res.render('index', { records, categories, totalAmount })
    })
})

module.exports = router