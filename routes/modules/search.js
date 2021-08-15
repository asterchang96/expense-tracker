const express = require('express')
const router = express.Router()
const moment = require('moment')

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model


router.get('/', async(req, res)=> {
  const categories = await Category.find().sort({ date: 'desc' }).lean()
  const { chooseCategory, dateStart, dateEnd } = req.query
  let totalAmount = 0
  const userId = req.user._id
  /* console.log(moment(dateStart).isBetween(dateStart, dateEnd))  */

  
  if(!dateStart && !dateEnd) {//chooseCategory搜尋
    return Record.find({ category : chooseCategory, userId })
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
  }else if(dateStart && dateEnd){//chooseCategory、time搜尋
    if(chooseCategory === 'all'){
      return Record.find({ date: { $gte: (dateStart), $lte: (dateEnd) }, userId })
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
    }
    return Record.find({ category : chooseCategory, date: { $gte: (dateStart), $lte: (dateEnd) }, userId })
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
  }
  /* else{
    let error = true
    res.render('index', { error, records, categories, totalAmount, chooseCategory, dateStart, dateEnd })
  } */



})

module.exports = router
