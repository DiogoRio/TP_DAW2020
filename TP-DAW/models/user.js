//User model

var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
})

module.exports = mongoose.model('user', userSchema)