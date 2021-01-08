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
       
    })

    return newResource.save()
}

module.exports.listResource = listResource;
module.exports.createResourse = createResourse;
module.exports.insert = insert;