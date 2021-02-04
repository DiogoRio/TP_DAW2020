//News model

var mongoose = require('mongoose')

var pieGraphSchema = new mongoose.Schema({
    y: Number,
    label: String
})

module.exports = mongoose.model('pieGraphSchema', pieGraphSchema)