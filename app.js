const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const handlebarsHelpers  = require('handlebars-helpers')(['array', 'comparison'])
const Handlebars = require('handlebars')

const routes = require('./routes/main')
require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

Handlebars.registerHelper('getIcon', function (a, b) {
  function isSameCategory(categoryDatabase) {
      return categoryDatabase.category === a
  }
  return b.find(isSameCategory).iconClass
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))


app.use(routes)

  
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})