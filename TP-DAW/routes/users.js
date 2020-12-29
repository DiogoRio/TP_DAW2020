var express = require('express');
const { connection } = require('mongoose');
var router = express.Router();
var passport = require('passport');
const { validatePassword } = require('../lib/passwordUtils');
const User = require('../models/user')
const passwordUtils = require('../lib/passwordUtils')

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
  
  User.findOne({username: req.body.username})
    .then((user) => {
      if(user) {
        req.flash('error', 'Username already used.')
        res.redirect('/users/register')
      }else{
        const saltHash = passwordUtils.genPassword(req.body.password)

        const salt = saltHash.salt
        const hash = saltHash.hash
  
        const newUser = new User({
          username: req.body.username,
          hash: hash,
          salt: salt
        })

        newUser.save()
        .then((user) => {
          console.log(user)
        })

        res.redirect('/users/login')
      }
    })
    .catch((err) => {
      console.log(err)
      res.redirect('/users/register')
    }) 
});

module.exports = router;