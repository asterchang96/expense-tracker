const express = require('express')
const router = express.Router()

const User = require('../../models/user')

//登入
router.get('/login',(req, res) => {
  res.render('login')
})

router.post('/login',(req, res) => {

})

//註冊
router.get('/register',(req, res) => {
  res.render('register')
})

router.post('/register',(req, res) => {
  const { name, email, password, confirmPassword } = req.body
  console.log(name, email, password, confirmPassword)
  //檢查是否已註冊
  User.findOne({ email })
    .then(user => {
      //已經註冊
      if(user){
        // TODO should add alert when user is in database
        console.log(email," 此用戶已註冊！")
        return res.render('register',{
          name,
          email,
          password,
          confirmPassword
        })
      }else{
        if(password !== confirmPassword){
          console.log(email," 此用戶密碼與驗證密碼不相符！")
          // TODO should add alert when password != confirmPassword
          return res.render('register',{
            name,
            email,
            password
          })
        }

        // TODO password bcrypt salt
        return User.create({
          name,
          email,
          password
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))    
      }
    })
})



module.exports = router