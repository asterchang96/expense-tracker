//使用者認證
module.exports = {
  authenticator: (req, res, next) => {
    if(req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login')
  }
}