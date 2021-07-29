const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 3000

const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))
const Category = require('./models/category') // 載入 category model
const Record = require('./models/record') // 載入 record model

app.get('/', async (req, res) => {
  let totalAmount = 0
  const categories = await Category.find().lean()
  return Record.find()
    .lean()
    .sort({ date: 'asc' })
    .then((records) => {
      
      records.forEach((record) => {
        // TODO1: totalAmount by records amount total
        if(record.incomeOrExpenses === '收入') totalAmount += record.amount
        else totalAmount -= record.amount
        // TODO2: icon if records category === categories's category then put categories icon

      })
      res.render('index', { records, categories, totalAmount })
    })
    .catch((error) => {
      console.log(error)
    })
  
   
})

app.get('/records/new', (req, res) => {
  Category.find()
    .lean()
    .then((categories) => {
      const categoryIncome = categories.filter(element => {
        if (element.incomeOrExpenses === '收入') return element.category
      })
      const categoryExpense = categories.filter(element => {
        if (element.incomeOrExpenses === '支出') return element.category
      })
      res.render('new', { categoryIncome, categoryExpense } )
    })
    
})

app.post('/records', (req, res) => {
  console.log(req.body)
  /* const { name, date, category, amount } = req.body
  console.log(name, date, category, amount) */
})

// TODO3 設計表單
// TODO4 可以連結、新增至mongoDB
// TODO5 使用至edit表單
// TODO6 可以連結、修改至mongoDB

// TODO7 DELETE 可以使用 連至mongoDB刪除
// TODO8 雙重確認

// TODO9 封包修正

// TODO10 連至koruko

app.listen( PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})