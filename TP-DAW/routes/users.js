var express = require('express');
const { connection } = require('mongoose');
var router = express.Router();
var passport = require('passport');
const { validatePassword } = require('../lib/passwordUtils');
const User = require('../models/user')
const UserCont = require('../controllers/user')
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
    successRedirect: '/resources'
 }))
 

router.post('/register', (req, res, next) => {
  registerController.register(req,res);
});

router.get('/edit/:id',async (req, res, next) => {
  //console.log("Trying to edit " + req.params.id);
  try{
      var id = req.params.id;
      var user = await UserCont.lookUp(id)
      res.render('editUser', {user:user})
  }
  catch{
    const html = '<p>Ocorreu um erro</p>';
    res.send(html);
  }
});

router.post("/edit/:id", async (req, res, next) => {
  try{
    var id = req.params.id;
    await UserCont.updateUser(id, req.body)
    console.log("User update")
    res.redirect('/myaccount')
  }
  catch{
    const html = '<p>Nao foi possivel efetuar a mudança</p>';
    res.send(html);
  }
})

module.exports = router;