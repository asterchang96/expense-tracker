const bcrypt = require('bcryptjs')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config() 
}

const Record = require('../record.js')
const User = require('../user.js')
const { recordSeeders } = require('./seeds.json')

const db = require('../../config/mongoose')


const SEED_USER = {
  name: 'root',
  email:'root@example.com',
  password: '12345678',
  photo: 'https://i.imgur.com/7Y2HmNG.png'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash,
      photo: SEED_USER.photo
    }))
    .then(user => {
      const userId = user._id

      return Promise.all(Array.from(
        { length: recordSeeders.length },
        (_, i) => Record.create({ ...recordSeeders[i], userId })
      ))
    })
    .then(() => {
      console.log('record done.')
      process.exit()
    })
    .catch(err => console.log('record error: ' + err))

})
