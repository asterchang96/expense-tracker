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

router.get('/new', (req, res) => {
    getCategory()
    return res.render('new', { categoryIncome, categoryExpense })
    
})

router.post('/', (req, res) => {
  const { incomeOrExpenses, name, date, category, amount, merchant } = req.body
  const userId = req.user._id

  Category.find({ "category": category }).then(element => {
    let categoryOptionTrueOrFalse = element
    if(categoryOptionTrueOrFalse.length === 1 && categoryOptionTrueOrFalse[0]['incomeOrExpenses'] === incomeOrExpenses){
      return Record.create({ incomeOrExpenses, name, date, category, amount, merchant, userId })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
    }else{    
      const categoryError = true
      return res.render('new', { incomeOrExpenses, name, date, category, amount, categoryError, categoryIncome, categoryExpense, merchant })
    }
  })
})

router.get('/:id/edit', (req, res) => {
  getCategory()
  const _id = req.params._id
  const userId = req.user._id

  return Record.findOne({ _id, userId })
    .lean()
    .then(record => res.render('edit', { record,  categoryIncome, categoryExpense }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  // 可以連結、修改至mongoDB
  const _id = req.params._id
  const userId = req.user._id
  const { incomeOrExpenses, name, date, category, amount, merchant } = req.body

  Category.find({"category": category}).then(element => {
    let categoryOptionTrueOrFalse = element
    if(categoryOptionTrueOrFalse.length === 1 && categoryOptionTrueOrFalse[0]['incomeOrExpenses'] === incomeOrExpenses){
      Record.findOne({ _id, userId })
        .then(record => {
          record.incomeOrExpenses = incomeOrExpenses
          record.name = name
          record.date = date
          record.category = category
          record.amount = amount
          record.merchant = merchant
          record.save()
        })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))      
    }else{    
      const categoryError = true
      return res.render('edit', { id, incomeOrExpenses, name, date, category, amount, merchant, categoryError, categoryIncome, categoryExpense })
    }
  })
})

router.delete('/:id', (req, res) => {
  // DELETE 可以使用 連至mongoDB刪除
  const _id = req.params._id.trim()
  const userId = req.user._id

  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
