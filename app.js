const express = require('express')

const bodyParser = require('body-parser')
const PORT = 3000

const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Helpers = require('handlebars-helpers')(['array', 'comparison'])
const Handlebars  = require('handlebars')

const routes = require('./routes/main')
const app = express()

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
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs',helpers:Helpers}))

Handlebars.registerHelper('getIcon', function (a, b) {
  function isSameCategory(categoryDatabase) {
      return categoryDatabase.category === a
  }
  return b.find(isSameCategory).iconClass
})

app.set('view engine', 'hbs')
app.use(methodOverride('_method'))

// setting static files
app.use(express.static('public'))
const Category = require('./models/category') // 載入 category model
const Record = require('./models/record') // 載入 record model



app.use(routes)

//  search
app.get('/search', async(req, res)=> {
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
  

app.listen( PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})