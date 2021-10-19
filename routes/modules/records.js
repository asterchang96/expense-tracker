const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model


let categories = []

router.get('/new', async (req, res) => {
  categories = await Category.find().sort().lean()
  return res.render('new', { categories })
})

router.post('/', async (req, res, next) => {
  try{
    const { name, date, category, amount, merchant } = req.body
    const userId = req.user._id
    const formErrors = []

    // TODO 驗證資料
    if(!name.trim().length || !category.trim().length || !date.trim().length || !amount.trim().length) formErrors.push({ message: '有*的項目皆為必填，且不可為空格！' })
    if(name.trim().length > 10) formErrors.push({ message: '名稱字數請於10字以內！' })
    if (amount <= 0) formErrors.push({ message: '金額必須大於0！' })
    if (isNaN(Number(amount))) formErrors.push({ message: '金額欄位僅能輸入數字資料' })
    if (formErrors.length) return res.render('new', { categories, name, date, amount, category, formErrors })

    const categoryData = await Category.find({ category })
    const incomeOrExpenses = categoryData.incomeOrExpenses
    await Record.create({ incomeOrExpenses, name, date, category, amount, merchant, userId })
    return res.redirect('/')
  }catch(err){
    next(err)
  }
})

router.get('/:id/edit', async (req, res, next) => {
  try{
    const _id = req.params.id
    const userId = req.user._id
    const categories = await Category.find().sort().lean()
    const record = await Record.findOne({ _id, userId }).lean()

    return res.render('edit', { record, categories })
  }catch(err) {
    next(err)
  }

})


router.put('/:id', async (req, res, next) => {
  try{
    const _id = req.params.id
    const userId = req.user._id
    const { name, date, category, amount, merchant } = req.body
    const modifiedRecord = req.body

    const formErrors = []
    // TODO 驗證資料
    if(!name.trim().length || !category.trim().length || !date.trim().length || !amount.trim().length) formErrors.push({ message: '有*的項目皆為必填，且不可為空格！' })
    if(name.trim().length > 10) formErrors.push({ message: '名稱字數請於10字以內！' })
    if (amount <= 0) formErrors.push({ message: '金額必須大於0！' })
    if (isNaN(Number(amount))) formErrors.push({ message: '金額欄位僅能輸入數字資料' })
    if (formErrors.length) return res.render('new', { name, date, amount, category, formErrors })

    const recordFilter = { _id, userId }
    await Record.findOneAndUpdate(recordFilter, modifiedRecord, {
      useFindAndModify: false
    })
    req.flash('success_messages', '已成功修改支出紀錄！')
    res.redirect('/')
  }catch(err) {
    next(err)
  }


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
