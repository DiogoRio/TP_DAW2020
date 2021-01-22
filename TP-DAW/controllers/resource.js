var Resource = require('../models/resource')

function listResource(){
    return Resource
        .find()
        .sort({title:1})
        .exec()
}

function createResourse(title,type,dateR,visibility,author) {
    var dateReg = new Date().toISOString().slice(0, 10)
    const newResource = new Resource({
        title: title,
        typeR: type,
        creDate: dateR, 
        regDate: dateReg,
        visibility: visibility, 
        author: author,
        points: 0
    })

    newResource.save()
    .then((resource) => {
        console.log(resource)
    })
}


function insert(data) {
    var dateReg = new Date().toISOString().slice(0, 10)
    const newResource = new Resource({
        title: data.title,
        typeR: data.type,
        creDate: data.creDate, 
        regDate: dateReg,
        visibility: data.visibility, 
        author: data.author,
        points: 0
    })

    return newResource.save()
}

function lookup(id){
    return Resource
    .findOne({_id: id})
    .exec()
}


function addComment(pub, comentario){
    return Resource
        .updateOne({_id: pub}, {$push: {comments: comentario}},{returnOriginal: false})
}

module.exports.listResource = listResource;
module.exports.createResourse = createResourse;
module.exports.insert = insert;
module.exports.lookup = lookup;
module.exports.addComment = addComment;

