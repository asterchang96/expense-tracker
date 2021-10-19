const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../models/user')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, ( req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if(!user){
          return done(null, false, req.flash('error_msg', '這個信箱尚未註冊！'))
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if(!isMatch){
            return done(null, false, req.flash('error_msg', '這個信箱或密碼錯誤！'))
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))
  // 設定FB登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName', 'photos']
  },
  (accessToken, refreshToken, profile, done) => {
    const { name, email, picture } = profile._json
    console.log('picture', picture)
    const { url }  = picture.data
    User.findOne({ email })
      .then(user => {
        //用戶已使用過
        if(user) return done(null, user)
          
        const randomPassword = Math.random().toString(36).slice(-8)
          
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash,
            photo: url,
          }))
          .then(user => done(null, user))
          .catch(err => done(err, user))
      })
    }
  ))


  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })

}