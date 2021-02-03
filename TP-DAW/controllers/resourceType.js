//Resource Type Controller

var Type = require('../models/resourceType')


//adiciona um novo tipo de recurso (caso este tipo não exista)
function add(type){
    return Type.findOne({type:type}).then( (found) => {
        if(!found){
            var newtype = new Type ({
                type:type
            })
            newtype.save()
        }
    })
}

function getAll(){
    return Type.find({},{_id:0,type:1});
}

module.exports.add = add;
module.exports.getAll = getAll;