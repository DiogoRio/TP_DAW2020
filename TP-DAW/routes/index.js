var express = require('express');
var router = express.Router();
var News = require('../controllers/news')
var Res = require('../controllers/resource')
var Resource = require('../models/resource')
var User = require('../controllers/user')


router.get('/myaccount', async (req, res) => {
  if(req.isAuthenticated()){
      try{
          //console.log(req.user.username)
          var resources = await Resource.find({})
          var users = await User.getUser(req.user.username)
          var number = await Res.lookupResource(req.user.username)
          //console.log(number)
          //console.log(users)
          //console.log(resources)
          //console.log(req.user.username)
          res.render('account', {
              resources: resources,
              users : users,
              n : number
          })
      }catch{
          res.redirect('/')
      }
    }else{
      res.redirect('/users/login')
    }
});

/* GET home page. */
router.get('/', async(req, res, next) => {
  var news = await News.getNews()
  var tmp = news.reverse();
  const resources = await Resource.find({})
  res.render('index', {news: tmp, resources: resources})
});

module.exports = router;