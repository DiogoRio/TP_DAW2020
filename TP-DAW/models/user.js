//User model

var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    name: String,
    regDate: String, //Registry Date
    type: String,    //User, Author, Admin
    hash: String,
    salt: String,
})

module.exports = mongoose.model('user', userSchema)