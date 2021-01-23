//User Controller

const user = require('../models/user');
var User = require('../models/user')

//Calls à mongoDB para devolver info
// ....

function getUserByName(username){
    return User.findOne({username: username}).exec()
}

function getUserByEmail(email){
    return User.findOne({email: email}).exec()
}

function createUser(username,email,name,location,department,course,hash,salt){
    var date = new Date().toISOString().slice(0, 10)
    const newUser = new User({
        username: username,
        email: email,
        name: name,
        type: "user",
        regDate: date,
        hash: hash,
        salt: salt,
        location:location,
        department:department,
        course:course
    })

    newUser.save()
    .then((user) => {
        console.log(user)
    })
}
function lookUp(id){
    return User
    .findOne({_id:id})
    .exec()
}

function getUser(name){
    return User
    .findOne({username:name})
    .exec()
}

module.exports.getUserByEmail = getUserByEmail;
module.exports.getUserByName = getUserByName;
module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.lookUp = lookUp;
