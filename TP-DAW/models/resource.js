//Resource model

const mongoose = require('mongoose')
const path = require('path')
const resResource = "uploads/"

var commentSchema = new mongoose.Schema({
    date: String,
    author: String,
    description: String
});

var ratingSchema = new mongoose.Schema({
    author: String,
    point: Number
});

var resourceSchema = new mongoose.Schema({
    typeR: String,
    title: String,
    creDate: String, 
    regDate: String, //System Date
    visibility: String, //Public or Private
    author: String,
    nameR: String,
    comments: [commentSchema],
    points: [ratingSchema],
    totalP: Number,
    path: String
})

//resourceSchema.virtual('resourceImagePath').get(function(){
//    if(this.nameR != null){
//        return path.join('/', resResource, this.nameR)
//    }
//})

module.exports = mongoose.model('resource', resourceSchema)
module.exports.resResource = resResource