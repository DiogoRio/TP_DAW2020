//User Controller
var News = require('../models/news')

//Ads News to the database
function addNews(author,title,body,date){
    const newNews = new News({
        author: author,
        date: date,
        body: body,
        title: title
    })

    newNews.save().then((news) => console.log(news))
}


function addNewPostNews(author,article_name){
    var date = new Date().toISOString().slice(0, 10)
    var body = `The user ${author} published an article called ${article_name}!`
    var title = `New article by ${author}`
    addNews(author,title,body,date)
}

function getNews(){
    return News.find({},{_id:0, __v:0}).exec();
}

module.exports.addNewPostNews = addNewPostNews
module.exports.getNews = getNews