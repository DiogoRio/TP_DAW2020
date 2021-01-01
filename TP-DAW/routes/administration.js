var express = require('express');
var router = express.Router();

/* GET administration home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all posts */
router.get('/posts', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

module.exports = router;

