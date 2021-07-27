const express = require('express')
const app = express()
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


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))
const Category = require('./models/category') // 載入 category model
const Record = require('./models/record') // 載入 record model

app.get('/', async (req, res) => {
  let totalAmount = 0
  const categories = await Category.find().lean()
  const records = await Record.find().lean()

  res.render('index', { records, categories, totalAmount })
})

app.get('/new', (req, res) => {
    res.render('new')
})

app.listen( PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
