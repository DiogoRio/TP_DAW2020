//User model

var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    name: String,
    password: String
})

module.exports = mongoose.model('user', userSchema)