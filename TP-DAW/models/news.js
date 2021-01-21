//News model

var mongoose = require('mongoose')

var NewsSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: String,
    date: String,
})

module.exports = mongoose.model('news', NewsSchema)