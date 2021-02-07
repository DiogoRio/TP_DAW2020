var express = require('express');
const { connection } = require('mongoose');
var router = express.Router();
var passport = require('passport');
const { validatePassword } = require('../lib/passwordUtils');
const User = require('../models/user')
const UserCont = require('../controllers/user')
const passwordUtils = require('../lib/passwordUtils')
const registerController = require('../controllers/register')
const Depart = require('../controllers/depart')

router.get('/', (req, res, next) => {
  if(req.isAuthenticated()){
    UserCont.listUsers()
      .then(users =>{
        Depart.listDeparts()
          .then(async(departs) => {
            var courses = await Depart.listCourses()
            res.render('users', {users: users, departs: departs, courses: courses, auth: true})
          })
      })
      .catch(e => res.status(500).jsonp(e))
  }else{
    res.redirect('/users/login')
  }
})

router.get('/login', (req, res, next) => {
  const errors = req.flash("error")
  console.log("errors: " + errors)
  res.render('login', {errors});
})

router.get('/register', async(req, res, next) => {
  const error = req.flash("error")
  var departs = await Depart.listDeparts()
  var courses = await Depart.listCourses()
  res.render('register', {
    error,
    departs: departs,
    courses: courses
  })
});

router.get('/logout', (req, res, next) => {
  req.logOut()
  res.redirect('/users/login')
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/users/login', 
    successRedirect: '/resources'
 }))
 

router.post('/register', (req, res, next) => {
  registerController.register(req,res);
});

router.get("/edit/pass", async (req, res, next) => {
  if(req.isAuthenticated()){
    //testar se a oldPass esta correta
    res.render('editPassword', {errors: []})
  }else{
    res.redirect('/users/login')
  }
})

router.post("/edit/pass", async (req, res, next) => {
  if(req.isAuthenticated()){
    isValid = validatePassword(req.body.currPassword, req.user.hash, req.user.salt)
    if(isValid && req.body.password == req.body.confirmPassword){
      UserCont.alterPassword(req.user.username, req.body.password)
      res.redirect('/myaccount')
    }else if(req.body.password == req.body.confirmPassword){
      res.render('editPassword', {errors: ["\"Current password\" field doesn't match user password."]})
    }else{
      res.render('editPassword', {errors: ["\"New password\" field doesn't match \"Confirm new password\" field."]})
    } 
  }else{
    res.redirect('users/login')
  }
})


router.get('/edit/:id',async (req, res, next) => {
  if(req.isAuthenticated()){
    try{
        var id = req.params.id;
        var user = await UserCont.lookUp(id)
        res.render('editUser', {user:user})
    }
    catch{
      console.log('Erro ao aceder pag editar user')
      res.render('errors/editUserError')
    }
  }
  else{
    res.redirect('/users/login')
  }
});


router.post("/edit/:id", async (req, res, next) => {
  if(req.isAuthenticated()){
    try{
      var id = req.params.id;
      await UserCont.updateUser(id, req.body)
      console.log("User update")
      res.redirect('/myaccount')
    }
    catch{
      console.log('Erro ao editar user')
      res.render('errors/editUserPageError')
    }
  }
  else{
  res.redirect('/users/login')
  }
})

module.exports = router;