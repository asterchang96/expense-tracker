const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const handlebarsHelpers  = require('handlebars-helpers')(['array', 'comparison'])

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const PORT = process.env.PORT
const routes = require('./routes/main')
require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers:handlebarsHelpers }))
app.set('view engine', 'hbs')



app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.use(session({ 
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true
}))

usePassport(app)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})


// TODO 前後端表格驗證(new/edit)
/*
new 可以新增類別 但沒有在資料庫的類別會顯示不通過 -->做一個前端表單驗證
*/
//　TODO　非同步語法錯誤　--> 目前已將所有await/async刪除
// TODO getCategory 必須使用非同步語法(有資料是因為之後執行才有，但如果一開始使用則會系統崩潰)