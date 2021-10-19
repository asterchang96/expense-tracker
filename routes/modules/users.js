const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

//登入
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

//註冊
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res, next) => {
  try{
    const { name, email, password, confirmPassword } = req.body
    const errors = []

    //檢查是否已註冊
    //(沒有填資料)
    if(!name || !email || !password || !confirmPassword){
      errors.push({ message: '所有欄位都是必填！'})
    }
    //(密碼與確認密碼不相符！)
    if( password !== confirmPassword){
      errors.push({ message: '密碼與確認密碼不相符！'})
    }

    if(errors.length){
      return res.render('register',{
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    //(有)
    const user = await User.findOne({ email })

    //已經註冊
    if(user){
      errors.push({ message: '此用戶已註冊！'})
      return res.render('register',{ name, email, password, confirmPassword })
    }

    //未註冊 
    // TODO 顯示成功註冊
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    await User.create({ name, email, password: hashPassword })
    return res.redirect('/')
  }catch(err){
    next(err)
  }

})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router