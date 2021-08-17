const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model
const { getIconClass } = require('../../public/javascripts/functionTools')

router.get('/', async(req, res)=> {
  const categories = await Category.find().sort({ date: 'desc' }).lean()
  const { chooseCategory, dateStart, dateEnd } = req.query
  let totalAmount = 0
  const userId = req.user._id
  const formErrors = []
  /* console.log(moment(dateStart).isBetween(dateStart, dateEnd))  */

  //TODO 判斷合理性
  // 不可以dataStart大於dateEnd
  if(dateEnd < dateStart) formErrors.push({ message: '結束時間不可以小於起始時間，請重新輸入或點選刪除！' })
  // 如果僅輸入一項時間 dateStart:該時間以後 dateEnd:該時間以前
  if (formErrors.length) return res.render('index', { categories,formErrors })

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
            record.iconClass = getIconClass(record.category, categories)
          })
          res.render('index', { records, categories, totalAmount, chooseCategory, dateStart, dateEnd })
        })  
})

module.exports = router
