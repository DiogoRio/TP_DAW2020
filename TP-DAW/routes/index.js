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

          res.render('account', {
              resources: resources,
              users : users,
              n : number,
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


/*

//Testes do controlador dos departamentos -> mover para zona de administrador

// devolve todos os departamentos

router.get('/departs', (req, res, next) =>{
  Depart.listDeparts()
  .then(dados => res.send(dados))
  .catch(e => res.send(e))
})

// adiciona um novo departamento

router.post('/depart', (req, res, next) =>{
  Depart.addDepart(req.body.id, req.body.designation)
  .then(dados => res.send(dados))
  .catch(e => res.send(e))
})

// adiciona um novo curso a um departamento

router.post('/depart/:id/add', (req, res, next) =>{
  Depart.addCourse(req.params.id, req.body.id, req.body.designation)
    .then(dados => res.send(dados))
    .catch(e => res.send(e))
})

*/

module.exports = router;