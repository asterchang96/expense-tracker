const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model
const { getIconClass } = require('../../public/javascripts/functionTools')


router.get('/', (req, res) => {
  let totalAmount = 0
  const userId = req.user._id
  
  Promise.all([Category.find().lean(), Record.find({ userId }).lean().sort({ date: 'desc' })])
    .then((results) => {
      const [categories, records] = results

      records.forEach((record) => {
          if(record.incomeOrExpenses === '收入') totalAmount += record.amount
          else totalAmount -= record.amount
          record.iconClass = getIconClass(record.category, categories)
        })
        res.render('index', { records, categories, totalAmount })
    })
    .catch(error => console.log(error))

})

module.exports = router