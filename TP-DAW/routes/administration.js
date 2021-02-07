var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var Depart = require('../controllers/depart')
var UserCont = require('../controllers/user')
var Resource = require('../controllers/resource')
var ResourceType = require('../controllers/resourceType');
var Graph = require('../controllers/graphs')


function isAdmin(req, res, next) {
  if (req.isAuthenticated() && (req.user.type == "admin") ) {
    next(); 
  } else {
    console.log("Not an Admin!")
    next(createError(404))
  }
}

//comentar isto para correr os scripts de povoamento
router.all("/*", isAdmin, function(req, res, next) {
  next(); 
});

/* GET administration home page. */
router.get('/', async(req, res, next) => {
  const errors = req.flash("error")
  var departs = await Depart.listDeparts()
  res.render('administration/main',{errors: errors, departs:departs});
});

//Get data for the administration pie graph
router.get('/piegraphdata', async(req, res, next) => {
  await Graph.updateTypesFromDB()
  var total = await Resource.countResources()
    Graph.getPieGraphData().then((data) => {
      res.send({data,total})
    }).catch(e => res.status(500).send(e))
});

//Get data for the administration Doughnut graph
router.get('/doughnut', async(req, res, next) => {
  var data = await Graph.getDoughnutGraphData();
  res.send(data)
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
  .then(
    (departs) => res.render('administration/departs', {departs:departs})
  )
  .catch(e => res.send(e))
})

router.get('/users', function(req, res, next) {
  UserCont.listUsers()
  .then(users =>{
    Depart.listDeparts()
      .then(async(departs) => {
        var courses = await Depart.listCourses()
        res.render('administration/users', {users: users, departs: departs, courses: courses})
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
  UserCont.updateUserByUsername(req.params.username,user)
  .then(() => {
    if(user.admin){
      UserCont.grantAdminPriviledges(user.username).then(res.redirect('/administration/users'))
    }
    else{
      UserCont.removeAdminPriviledges(user.username).then(res.redirect('/administration/users'))
    }
  })
  .catch(e => {console.log(e);res.status(500).jsonp(e)})
})

router.post('/users/remove/:username', (req,res,next) => {
  UserCont.removeUserByUsername(req.params.username)
  .then(
    Resource.deleteResourceFromUser(req.params.username).then(
      res.redirect('/administration/users')
    )
    .catch(e => res.status(500).jsonp(e))
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
router.post('/departs/add', (req, res, next) =>{
  Depart.addDepart(req.body.designation)
  .then(res.redirect('/administration/departs'))
  .catch(e => res.send(e))
})

// Remove um departamento
router.post('/departs/remove/:id', (req, res, next) =>{
  Depart.deleteDepart(req.params.id)
  .then(res.redirect('/administration/departs'))
  .catch(e => res.send(e))
})

//Add departments page
router.get('/depart/add', (req, res, next) =>{
  const errors = req.flash("error")
  res.render('administration/newDepart', {errors});
})

// adiciona um novo curso a um departamento
router.post('/depart/:id/add', (req, res, next) =>{
  Depart.addCourse(req.params.id, req.body.designation)
    .then(() => res.redirect("/administration/departs/" + req.params.id))
    .catch(e => res.send(e))
})

router.post('/departs/:did/remove/:id', (req, res, next) =>{
  Depart.removeCourseFromDepart(req.params.did, req.params.id)
    .then(() => res.redirect("/administration/departs/" + req.params.did))
    .catch(e => res.send(e))
})

//pagina de adicionar novo curso
router.get('/depart/:id/add', (req, res, next) =>{
  const errors = req.flash("error")
  var id = req.params.id
  res.render('administration/newCourse', {errors,id});
})

//pagina de cursos de um departamento
router.get('/departs/:id', (req, res, next) =>{
  var id = req.params.id
  Depart.getDepById(id).then( (dep) =>{
    var courses = dep.courses
    res.render('administration/courses', {dep:dep,courses:courses});
  })
  .catch(e => res.status(500).send(e))
})

//adiciona um novo tipo de recurso
router.post('/resourceTypes', (req, res, next) =>{
  ResourceType.add(req.body.type)
    .then(() => {res.redirect('/administration/resourceTypes')})
    .catch(e => res.send(e))
})




module.exports = router;

