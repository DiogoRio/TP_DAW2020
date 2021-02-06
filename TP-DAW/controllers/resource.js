var Resource = require('../models/resource')

function listResource(){
    return Resource
        .find()
        .sort({title:1})
        .exec()
}


// Retorna todos os recursos presentes na base de dados
function getResources(){
    return Resource.find({});
}

function countResources(){
    return Resource.countDocuments({})
}

function countResourcesByType(type){
    return Resource.countDocuments({typeR: type});
}

function createResourse(title,type,dateR,visibility,author) {
    var dateReg = new Date().toISOString().substr(0, 10)
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
    var dateReg = new Date().toISOString().substr(0, 10)
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
function lookupByAuthor(name){
    return Resource
    .find({author:name})
    .exec()
}

function lookupResource(name){
    return Resource
    .countDocuments({author:name})
    .exec()
}
function lookupResourcePoints(id){
    return Resource
    .findOne({_id: id})
    .select({_id:0, points:1})
    .exec()
}

function lookupPoints(id, author){
    return Resource
        .findOne({_id: id}, {points:{ $elemMatch:{author:author}}})
        .exec()
}


function addComment(id, comentario){
    return Resource
        .updateOne({_id: id}, {$push: {comments: comentario}},{returnOriginal: false})
}

function deleteComment(id, idC){
    return Resource
        .updateOne({_id: id}, {$pull: {comments:{ _id:idC}}},{returnOriginal: false})
}

function addRating(id, rate){
    return Resource
        .updateOne({_id: id}, {$push: {points: rate}},{returnOriginal: false})
}

function ratingResource(id,idR){
    return Resource
        .updateOne({_id: id}, {$pull: {points:{ _id:idR}}}, {returnOriginal: false})
}

function updatePoints(id,tpoints){
    return Resource
        .updateOne({_id: id}, {totalP:tpoints})
}

function updateDownloads(id){
    return Resource
        .updateOne({_id:id}, {$inc:{"downloads":+1}})
}

function updateResource(id, newResource){
    return Resource
        .updateOne({ _id: id }, newResource)
}

function deleteResource(id){
        return Resource
        .deleteOne({_id:id})
}

//TODO adicionar mesmas operações que em deleteResource (maybe retunar lista com ids a eliminar e usar deleResource para cada 1 deles)
function deleteResourceFromUser(username){
    return Resource.deleteMany({"author": username})
}

module.exports.listResource = listResource;
module.exports.createResourse = createResourse;
module.exports.insert = insert;
module.exports.lookup = lookup;
module.exports.addComment = addComment;
module.exports.lookupResource = lookupResource;
module.exports.updateResource = updateResource;
module.exports.deleteResource = deleteResource;
module.exports.deleteComment = deleteComment;
module.exports.addRating = addRating;
module.exports.lookupPoints = lookupPoints;
module.exports.ratingResource= ratingResource;
module.exports.lookupResourcePoints =lookupResourcePoints;
module.exports.updatePoints = updatePoints;
module.exports.lookupByAuthor = lookupByAuthor;
module.exports.deleteResourceFromUser = deleteResourceFromUser;
module.exports.getResources = getResources;
module.exports.countResourcesByType = countResourcesByType
module.exports.countResources = countResources
module.exports.updateDownloads = updateDownloads