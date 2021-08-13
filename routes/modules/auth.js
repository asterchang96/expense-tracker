const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

//Facebook 把資料發回來 === POST /users/login
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect:'/',
  failureRedirect:'/users/login'
}))

module.exports = router