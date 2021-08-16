const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model




router.get('/new', async(req, res) => {
  const categories = await Category.find().sort().lean()
  return res.render('new', { categories })
})

router.post('/', (req, res) => {
  const { name, date, category, amount, merchant } = req.body
  const userId = req.user._id

  Promise.all([Category.find({category})])
    .then(results => {
      const [[category]] = results
      const incomeOrExpenses = category.incomeOrExpenses
      return Record.create({ incomeOrExpenses, name, date, category, amount, merchant, userId })
    })
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Promise.all([Category.find().sort().lean(), Record.findOne({ _id, userId }).lean()])
    .then(results => {
      const [ categories, record ] = results
      res.render('edit', { record, categories })
    })
    .catch(error => console.log(error))
})


router.put('/:id', (req, res) => {
  // 可以連結、修改至mongoDB
  const _id = req.params.id
  const userId = req.user._id
  const { name, date, category, amount, merchant } = req.body
  console.log(category)

  Promise.all([Category.find({"category": category}), Record.findOne({ _id, userId })])
    .then(results => {
      const [ categoryData, record ] = results
      console.log("answer", categoryData, record)
     /*  record.incomeOrExpenses = categoryData.incomeOrExpenses
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.merchant = merchant
      record.save() */
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
