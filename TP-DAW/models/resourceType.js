//User model

var mongoose = require('mongoose')

var resourceTypeSchema = new mongoose.Schema({
    type:String
})

module.exports = mongoose.model('resourceType', resourceTypeSchema)