const express = require('express')
const app = express()
const PORT = 3000


const exphbs = require('express-handlebars')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.render('new')
})


app.listen( PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
