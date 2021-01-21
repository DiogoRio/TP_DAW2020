var express = require('express');
var router = express.Router();
var News = require('../controllers/news')
var Resource = require('../models/resource')

/* GET home page. */
router.get('/', async(req, res, next) => {
  var news = await News.getNews()
  const resources = await Resource.find({})
  console.log(news)
  res.render('index', {news: news, resources: resources})
});

module.exports = router;