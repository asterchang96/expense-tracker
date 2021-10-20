const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model
const { getIconClass } = require('../../public/tools/functions')
const pageLimit = 5

router.get('/', async (req, res, next)=> {
  try{
    const { chooseCategory, dateStart, dateEnd } = req.query
    let offset = 0
    let totalAmount = 0
    const userId = req.user._id
    const formErrors = []
    const categories = await Category.find().sort({ date: 'desc' }).lean()

    //處理分頁
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    // 不可以dataStart大於dateEnd
    if(dateEnd < dateStart) formErrors.push({ message: '結束時間不可以小於起始時間，請重新輸入或點選刪除！' })
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
    let records = await Record.find(conditionFilter).lean()
    const page = Number(req.query.page) || 1
    const pages = Math.ceil(records.length / Number(pageLimit))
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1

    records.forEach((record) => {
      totalAmount += record.amount
/*       if(record.incomeOrExpenses === '收入') totalAmount += record.amount
      else totalAmount -= record.amount */
      record.iconClass = getIconClass(record.category, categories)
    })

    let pageRecord = records.slice(offset, offset+pageLimit)

    res.render('index', { records: pageRecord, categories, totalAmount, chooseCategory, dateStart, dateEnd, page, totalPage, prev, next })
  }catch(err){
    next(err)
  }
})

module.exports = router
