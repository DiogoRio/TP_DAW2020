var express = require('express');
var router = express.Router();
var News = require('../controllers/news')
var Res = require('../controllers/resource')
var Resource = require('../models/resource')
var User = require('../controllers/user')
var Depart = require('../controllers/depart')


router.get('/myaccount', async (req, res) => {
  if(req.isAuthenticated()){
      try{
          var resources = await Resource.find({})
          var users = await User.getUser(req.user.username)
          var number = await Res.lookupResource(req.user.username)
          var departs = await Depart.listDeparts()
          var courses = await Depart.listCourses()
          var userDep = await Depart.getDepById(users.department)
          var userCourse = await Depart.getCourseById(users.course)

          res.render('account', {
              resources: resources,
              users : users,
              n : number,
              departs: departs,
              courses: courses,
              userDep: userDep,
              userCourse: userCourse,
              auth: true 
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
  const authMain = req.isAuthenticated()
  res.render('index', {news: tmp, resources: resources, auth:authMain})
});


module.exports = router;