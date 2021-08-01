const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model


router.get('/', async(req, res)=> {
  const categories = await Category.find().sort({ _id: 'asc' }).lean()
  const { chooseCategory } = req.query
  let totalAmount = 0
  return await Record.find({ category : chooseCategory })
    .lean()
    .sort({ _id: 'desc'})
    .then((records) => {
      records.forEach((record) => {
        if(record.incomeOrExpenses === '收入') totalAmount += record.amount
        else totalAmount -= record.amount
      })
     res.render('index', { records, categories, totalAmount, chooseCategory })
    })    

})

module.exports = router
