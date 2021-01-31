var express = require('express');
var router = express.Router();
var Depart = require('../controllers/depart')


/* GET administration home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
router.get('/add/depart', (req, res, next) =>{
  const errors = req.flash("error")
  console.log("errors: " + errors)
  res.render('administration/newDepart', {errors});
})

// adiciona um novo curso a um departamento
router.post('/depart/:id/add', (req, res, next) =>{
  console.log("INSIDE POST")
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

