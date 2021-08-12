const express = require('express')
const router = express.Router()

const index = require('./modules/index')
const records = require('./modules/records')
const search = require('./modules/search')
const users = require('./modules/users')


router.use('/', index)
router.use('/records', records)
router.use('/search', search)
router.use('/users', users)





module.exports = router
