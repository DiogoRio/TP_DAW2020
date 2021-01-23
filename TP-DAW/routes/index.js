var express = require('express');
var router = express.Router();
var News = require('../controllers/news')
var Resource = require('../models/resource')

/* GET home page. */
router.get('/', async(req, res, next) => {
  var news = await News.getNews()
  var tmp = news.reverse();
  const resources = await Resource.find({})
  res.render('index', {news: tmp, resources: resources})
});

module.exports = router;