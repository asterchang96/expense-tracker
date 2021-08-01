const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 3000

const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const helpers = require('handlebars-helpers')


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
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs',
helpers:{
  getIcon: function (a, b) {
    function isSameCategory(categoryDatabase) {
      return categoryDatabase.category === a
    }
    const iconClass = b.find(isSameCategory).iconClass
    return iconClass
  }
}
}))
app.set('view engine', 'hbs')
app.use(methodOverride('_method'))

// setting static files
app.use(express.static('public'))
const Category = require('./models/category') // 載入 category model
const Record = require('./models/record') // 載入 record model

let categoryIncome = null
let categoryExpense = null

app.get('/', async (req, res) => {
  let totalAmount = 0
  const categories = await Category.find().lean()
  return Record.find()
    .lean()
    .sort({ date: 'asc' })
    .then((records) => {
      records.forEach((record) => {
        // totalAmount by records amount total
        if(record.incomeOrExpenses === '收入') totalAmount += record.amount
        else totalAmount -= record.amount
        // TODO　icon if records category === categories's category then put categories icon

      })
      res.render('index', { records, categories, totalAmount })
    })
    .catch((error) => {
      console.log(error)
    })
})

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
  
app.get('/records/new', (req, res) => {
    getCategory()
    return res.render('new', { categoryIncome, categoryExpense } )
})

app.post('/records', (req, res) => {
  // 可以連結、新增至mongoDB
  const { incomeOrExpenses, name, date, category, amount } = req.body

  return Record.create({ incomeOrExpenses, name, date, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.get('/records/:id/edit', async(req, res) => {
  getCategory()
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record,  categoryIncome, categoryExpense }))
    .catch(error => console.log(error))
})

app.post('/records/:id', (req, res) => {
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

app.post('/records/:id/delete', (req, res) => {
  // DELETE 可以使用 連至mongoDB刪除
  const id = req.params.id.trim()
  console.log(id)
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// TODO8 雙重確認
// TODO9 封包修正
// TODO10 連至koruko

app.listen( PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})


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