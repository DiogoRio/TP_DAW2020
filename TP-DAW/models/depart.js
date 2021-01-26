// Department model

var mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    id: {type: String, required: true},
    designation: String,
})

var departSchema = new mongoose.Schema({
    id: {type: String, required: true},
    designation: String,
    courses: [courseSchema],
})

module.exports = mongoose.model('depart', departSchema)