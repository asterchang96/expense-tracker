const express = require('express')
const router = express.Router()

const index = require('./modules/index')
const records = require('./modules/records')
const search = require('./modules/search')

router.use('/', index)
router.use('/records', records)
router.use('/search', search)





module.exports = router
