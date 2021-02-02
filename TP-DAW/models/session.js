var mongoose = require('mongoose')

var sessionSchema = new mongoose.Schema({
    _id : String,
    expires: String,
    session: String
})

module.exports = mongoose.model('session', sessionSchema)