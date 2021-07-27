const mongoose = require('mongoose')
const Record = require('../record')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection


let recordSeeder =[
  ["肯德基", "支出", "食", "2021/07/25", 500],
  ["Netflix月費", "支出", "樂", "2021/07/25", 1250],
  ["早餐", "支出", "食", "2021/07/26", 100],
  ["發票中獎", "收入", "零用錢", "2021/07/24", 200],
  ["ZARA", "支出", "衣", "2021/07/25", 2000],
  ["6月薪資", "收入", "薪水", "2021/07/25", 45000],
]



db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')

  recordSeeder.forEach(element => {
    Record.create({ 
      name: element[0],
      incomeOrExpenses: element[1],
      category: element[2],
      date: element[3],
      amount: element[4],
      })
  })
  console.log('Record done.')
})