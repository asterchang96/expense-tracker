const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model


router.get('/', async(req, res)=> {
  const categories = await Category.find().sort({ date: 'desc' }).lean()
  const { chooseCategory, dateStart, dateEnd } = req.query
  let totalAmount = 0
  const userId = req.user._id
  /* console.log(moment(dateStart).isBetween(dateStart, dateEnd))  */

  //建立過濾器
  let conditionFilter = {}
  conditionFilter.userId = userId
  if(chooseCategory !== 'all'){
    conditionFilter.category = chooseCategory
  }
  if(dateStart && dateEnd){
    conditionFilter.date = { $gte: (dateStart), $lte: (dateEnd) }
  }else if(dateStart && !dateEnd){
    conditionFilter.date = { $gte: (dateStart) }
  }else if(dateStart && !dateEnd){
    conditionFilter.date = { $lte: (dateEnd) }
  }

  return Record.find(conditionFilter)
        .lean()
        .sort({ date: 'desc'})
        .then((records) => {
          records.forEach((record) => {
            if(record.incomeOrExpenses === '收入') totalAmount += record.amount
            else totalAmount -= record.amount
            record.iconClass = (categories.find(category => (category.category === record.category))).iconClass
          })
          res.render('index', { records, categories, totalAmount, chooseCategory, dateStart, dateEnd })
        })  
})

module.exports = router
