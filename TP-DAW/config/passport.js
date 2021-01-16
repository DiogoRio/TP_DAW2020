var LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const passwordUtils = require('../lib/passwordUtils')

// os nomes que se espera que os campos de username e password tenham no req.body
const fields = {
  usernameField: 'username',
  emailField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

//Configuracao da estrategia local
const verifyCallback = (req, username, password, done) => {
  User.findOne({username: username})
    .then((user) => {
      if(!user) {
        return done(null, false, req.flash('error', 'No such user.'))}
      else{
        isValid = passwordUtils.validatePassword(password, user.hash, user.salt)
        if(isValid){
          return done(null, user)
        }  else{
          return done(null, false, req.flash('error', 'Incorrect password.'))
        }
      }
    })
    .catch((err) => {
      done(err)
    })
}

const strategy = new LocalStrategy(fields, verifyCallback);



module.exports = (passport) => {    
    passport.use(strategy)
    // Indica-se ao passport como serializar o utilizador
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
  
    // Desserializacao a partir do id obtem-se a informacao do utilizador
    passport.deserializeUser((userId, done) => {
        User.findById(userId)
        .then((user) => {
            done(null, user)
        })
      .catch(err => done(err))
  })
}