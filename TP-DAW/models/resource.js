//Resource model

const mongoose = require('mongoose')
const path = require('path')
const resResource = "uploads/"

var commentSchema = new mongoose.Schema({
    date: Date,
    authort: String,
    description: String
});

var resourceSchema = new mongoose.Schema({
    typeR: String,
    title: String,
    creDate: Date, 
    regDate: Date, //System Date
    visibility: String, //Public or Private
    author: String,
    nameR: String,
    comments: [commentSchema]
})

//resourceSchema.virtual('resourceImagePath').get(function(){
//    if(this.nameR != null){
//        return path.join('/', resResource, this.nameR)
//    }
//})

module.exports = mongoose.model('resource', resourceSchema)
module.exports.resResource = resResource