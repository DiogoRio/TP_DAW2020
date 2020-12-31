var express = require('express');
const { connection } = require('mongoose');
var router = express.Router();
var passport = require('passport');
const { validatePassword } = require('../lib/passwordUtils');
const User = require('../models/user')
const passwordUtils = require('../lib/passwordUtils')
const registerController = require('../controllers/register')

router.get('/login', (req, res, next) => {
  const errors = req.flash("error")
  console.log("errors: " + errors)
  res.render('login', {errors});
})

router.get('/register', (req, res, next) => {
  const error = req.flash("error")
  res.render('register', {error})
});

router.get('/logout', (req, res, next) => {
  req.logOut()
  res.redirect('/users/login')
})


router.get('/protegida', (req, res, next) => {
  if(req.isAuthenticated()){
    const html = '<p>Bem vindo à área protegida --> <a href="/users/logout">logout</a></p>';
    res.send(html);
  }else{
    res.redirect('/users/login')
  }
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/users/login', 
    successRedirect: '/users/protegida'
  }))
 


router.post('/register', (req, res, next) => {
  registerController.register(req,res);
});

module.exports = router;