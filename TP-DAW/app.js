var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var session = require('express-session');
const User = require('./models/user')
const MongoStore = require('connect-mongo')(session);
var db = require('./config/db')
flash = require('connect-flash');


var app = express();



// Authentication ----------------------------------------------------------
var passport = require('passport')
require('./config/passport')(passport)

//Sessions -----------------------------------------------------------------
const sessionStore = new MongoStore({ mongooseConnection: db, collection: 'sessions'})

app.use(session({  
  store: sessionStore,
  secret: 'auth',
  resave : false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1hr
  }
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
  console.log(req.session)
  console.log(req.user)
  next()
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const resourceRouter = require('./routes/resource');
const bodyParser = require('body-parser');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/resources', resourceRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
