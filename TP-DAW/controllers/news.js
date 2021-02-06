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


function addNewResourceNew(author,article_name,type){
    var date = new Date().toISOString().slice(0, 10)
    var body = `The user ${author} published an ${type} called ${article_name}!`
    var title = `New ${type} by ${author}`
    addNews(author,title,body,date)
}

function addNewUserNew(username,name){
    var date = new Date().toISOString().slice(0, 10)
    var body = `${name} just registered in our website with the username: ${username}, Welcome!`
    var title = `Welcome ${name} (${username})!`
    addNews(username,title,body,date)
}

function getNews(){
    return News.find({},{_id:0, __v:0}).exec();
}

module.exports.addNewResourceNew = addNewResourceNew
module.exports.getNews = getNews
module.exports.addNewUserNew = addNewUserNew