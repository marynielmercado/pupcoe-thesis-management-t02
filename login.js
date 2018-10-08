var express= require('express')
var router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs');
const db = require('../db/index')
const user = require('../models/users')

router.get('/', function(req, res, next) {
  res.render('./login', {
    layout: 'main',
    error: req.flash('error')
  })
})


router.post('/', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid credentials'}),
  function(req, res) {
    res.redirect('/login/account')
})


router.use('/account', function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.user_type === 'admin' || 'YES') {
      res.redirect('/adminpage')
    }
  }
})



module.exports = router