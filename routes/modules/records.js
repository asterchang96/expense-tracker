const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model


let categories = []

router.get('/new', async(req, res) => {
  categories = await Category.find().sort().lean()
  return res.render('new', { categories })
})

router.post('/', (req, res) => {
  const { name, date, category, amount, merchant } = req.body
  const userId = req.user._id
  const formErrors = []
  // TODO 驗證資料
  if(!name.trim().length || !category.trim().length || !date.trim().length || !amount.trim().length) formErrors.push({ message: '有*的項目皆為必填，且不可為空格！' })
  if(name.trim().length > 10) formErrors.push({ message: '名稱字數請於10字以內！' })
  if (amount <= 0) formErrors.push({ message: '金額必須大於0！' })
  if (isNaN(Number(amount))) formErrors.push({ message: '金額欄位僅能輸入數字資料' })
  if (formErrors.length) return res.render('new', { categories, name, date, amount, category, formErrors })

  Promise.all([Category.find({ category })])
    .then(results => {
      const [[categoryData]] = results
      const incomeOrExpenses = categoryData.incomeOrExpenses
      
      return Record.create({ incomeOrExpenses, name, date, category, amount, merchant, userId })
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Promise.all([Category.find().sort().lean(), Record.findOne({ _id, userId }).lean()])
    .then(results => {
      categories = results[0]
      const record  = results[1]
      res.render('edit', { record, categories })
    })
    .catch(error => console.log(error))
})


router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const { name, date, category, amount, merchant } = req.body

  const formErrors = []
  // TODO 驗證資料
  if(!name.trim().length || !category.trim().length || !date.trim().length || !amount.trim().length) formErrors.push({ message: '有*的項目皆為必填，且不可為空格！' })
  if(name.trim().length > 10) formErrors.push({ message: '名稱字數請於10字以內！' })
  if (amount <= 0) formErrors.push({ message: '金額必須大於0！' })
  if (isNaN(Number(amount))) formErrors.push({ message: '金額欄位僅能輸入數字資料' })
  if (formErrors.length) return res.render('new', { categories, name, date, amount, category, formErrors })


  Promise.all([Category.find({ category }), Record.findOne({ _id, userId })])
    .then(results => {
      const [ [categoryData], record ] = results
      record.incomeOrExpenses = categoryData.incomeOrExpenses
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.merchant = merchant
      record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error)) 
})


router.delete('/:id', (req, res) => {
  // DELETE 可以使用 連至mongoDB刪除
  const _id = req.params.id.trim()
  const userId = req.user._id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
