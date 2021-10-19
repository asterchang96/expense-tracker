const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model
const { getIconClass } = require('../../public/tools/functions')
const pageLimit = 5

router.get('/', async (req, res, next) => {
  try{
    let offset = 0
    let totalAmount = 0
    const userId = req.user._id

    //處理分頁
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    //先從資料庫取得所有資料，再進行排序
    let categories = await Category.find().lean()
    let records = await Record.find({ userId }).lean().sort({ date: 'desc' })
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
    return res.render('index', { records: pageRecord , categories, totalAmount, page, totalPage, prev, next })    
  }catch (err) {
    next(err)
  }
})

module.exports = router