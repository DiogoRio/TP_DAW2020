var express = require('express');
var router = express.Router();
var Depart = require('../controllers/depart')
const UserCont = require('../controllers/user')



/* GET administration home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
  UserCont.listUsers()
  .then(users =>{
    Depart.listDeparts()
      .then(async(departs) => {
        var courses = await Depart.listCourses()
        res.render('administration/users', {users: users, departs: departs, courses: courses, auth: true})
      })
  })
  .catch(e => res.status(500).jsonp(e))
});

router.post('/users/edit/:username', (req,res,next) => {
  const user = JSON.parse(JSON.stringify(req.body));
  console.log(user)
  if(user._id || user.username){
    console.log("error:")
    console.log(user)
    res.status(500)
  }
  else {
    UserCont.updateUserByUsername(req.params.username,user)
    .then(
      res.redirect('/administration/users')
    )
    .catch(e => res.status(500).jsonp(e))
  }
})

router.post('/users/remove/:username', (req,res,next) => {
  req.logout
  UserCont.removeUserByUsername(req.params.username)
  .then(
    res.redirect('/administration/users')
  )
  .catch(e => res.status(500).jsonp(e))
})

/* GET all posts */
router.get('/posts', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

// devolve todos os departamentos
router.get('/departs', (req, res, next) =>{
  Depart.listDeparts()
  .then(dados => res.send(dados))
  .catch(e => res.send(e))
})

// adiciona um novo departamento
router.post('/add/depart', (req, res, next) =>{
  Depart.addDepart(req.body.designation)
  .then(dados => res.send(dados))
  .catch(e => res.send(e))
})

//Add departments page
router.get('/depart/add', (req, res, next) =>{
  const errors = req.flash("error")
  console.log("errors: " + errors)
  res.render('administration/newDepart', {errors});
})

// adiciona um novo curso a um departamento
router.post('/depart/:id/add', (req, res, next) =>{
  Depart.addCourse(req.params.id, req.body.designation)
    .then(dados => res.send(dados))
    .catch(e => res.send(e))
})

//pagina de adicionar novo curso
router.get('/depart/:id/add', (req, res, next) =>{
  const errors = req.flash("error")
  console.log("errors: " + errors)
  var id = req.params.id
  res.render('administration/newCourse', {errors,id});
})


module.exports = router;

