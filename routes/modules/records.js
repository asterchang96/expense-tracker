const express = require('express')
const router = express.Router()

const Category = require('../../models/category') // 載入 category model
const Record = require('../../models/record') // 載入 record model

let categoryIncome = null
let categoryExpense = null
//區分收入/支出，對應category
function getCategory(){
  Category.find()
    .lean()
    .then((categories) => {
      categoryIncome = categories.filter(element => {
        if (element.incomeOrExpenses === '收入') return element.category
      })
      categoryExpense = categories.filter(element => {
        if (element.incomeOrExpenses === '支出') return element.category
      })
    })
}

router.get('/new', (req, res) => {
    getCategory()
    return res.render('new', { categoryIncome, categoryExpense } )
})

router.post('/', (req, res) => {
  // 可以連結、新增至mongoDB
  const { incomeOrExpenses, name, date, category, amount } = req.body
  //new 可以新增類別 但沒有在資料庫的類別會顯示不通過 -->做一個前端表單驗證
  //檢查 category 
  console.log(category)
  const categoryOptionTrueOrFalse = Category.findOne({"category": category})
  .lean()
  .then( category => console.log(category))
  console.log(categoryOptionTrueOrFalse)

  
  if(!categoryOptionTrueOrFalse){
    //沒有該選項 --> 失敗，傳回new，並顯示錯誤訊息
    console.log('categoryOptionTrueOrFalse成功了')
  }else if(categoryOptionTrueOrFalse === '薪水')
  {//有該選項 --> 成功，傳回首頁
    return Record.create({ incomeOrExpenses, name, date, category, amount })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))    
  }
})


router.get('/:id/edit', (req, res) => {
  getCategory()
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record,  categoryIncome, categoryExpense }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  // 可以連結、修改至mongoDB
  const id = req.params.id
  const { incomeOrExpenses, name, date, category, amount } = req.body
  Record.findById(id)
    .then(record => {
      record.incomeOrExpenses = incomeOrExpenses
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  // DELETE 可以使用 連至mongoDB刪除
  const id = req.params.id.trim()
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
