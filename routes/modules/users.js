const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imgur = require('imgur-node-api')
const fs = require('fs')

const User = require('../../models/user')
const { authenticator } = require('../../middleware/auth')
const { constants } = require('http2')
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
/* setting */
router.get('/setting', authenticator, async (req, res) => {
  return res.render('setting')
})

router.put('/setting', authenticator, upload.single('photo'), async (req, res, next) => {
  try{
    const recordFilter = { email: req.user.email }
    const { file } = req
    let modifiedRecord = {}
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, async(err, img) => {
        modifiedRecord.photo = file ? img.data.link : user.photo
        if(req.body) modifiedRecord.name = req.body.name
        await User.findOneAndUpdate(recordFilter, modifiedRecord, { useFindAndModify: false })
      })
    }else{
      if(req.body) modifiedRecord.name = req.body.name
      await User.findOneAndUpdate(recordFilter, modifiedRecord, { useFindAndModify: false })
    }
    return res.render('setting')
  }catch(err) {
    next(err)
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router