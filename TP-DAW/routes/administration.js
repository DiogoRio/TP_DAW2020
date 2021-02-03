var express = require('express');
var router = express.Router();
var Depart = require('../controllers/depart')
var UserCont = require('../controllers/user')
var Resource = require('../controllers/resource')
var ResourceType = require('../controllers/resourceType');




/* GET administration home page. */
router.get('/', async(req, res, next) => {
  const errors = req.flash("error")
  console.log("errors: " + errors)
  var departs = await Depart.listDeparts()
  res.render('administration/main',{errors: errors, departs:departs});
});

router.get('/resources', (req, res, next) => {
  ResourceType.getAll().then( (types) => {
    Resource.getResources().then( (resources) =>
      res.render('administration/resources', {resources:resources, types:types})
  )
  })
  .catch(e => res.send(e))
});

// devolve todos os departamentos
router.get('/departs', (req, res, next) =>{
  Depart.listDeparts()
  .then(dados => res.send(dados))
  .catch(e => res.send(e))
})

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


// devolve todos os tipos de recursos
router.get('/resourceTypes', (req, res, next) =>{
  ResourceType.getAll()
  .then(dados => res.send(dados))
  .catch(e => res.send(e))
})

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

//path que edita um recurso
router.post("/resources/edit/:id", async (req, res, next) => {
  const resource =  JSON.parse(JSON.stringify(req.body));
  Resource.updateResource(req.params.id,resource).then(
    res.redirect("/administration/resources")
  )
  .catch(e => res.status(500).jsonp(e))
})

//path que remove um recurso
router.post("/resources/remove/:id", async (req, res, next) => {
  Resource.deleteResource(req.params.id).then(
    res.redirect("/administration/resources")
  )
  .catch(e => res.status(500).jsonp(e))
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

//adiciona um novo tipo de recurso
router.post('/resourceTypes', (req, res, next) =>{
  console.log(req.body.type)
  ResourceType.add(req.body.type)
    .then(() => {res.redirect('/administration/resourceTypes')})
    .catch(e => res.send(e))
})




module.exports = router;

