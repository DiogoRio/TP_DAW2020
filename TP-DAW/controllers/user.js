//User Controller

const user = require('../models/user');
var User = require('../models/user')
var Session = require('../models/session')
var Resource = require('./resource')


//Calls à mongoDB para devolver info
// ....

function listUsers(){
    return User
        .find()
        .select('-_id -salt -hash -__v')
        .sort({username:1})
        .exec()
}

//procura um utilizador por username
function getUserByName(username){
    return User.findOne({username: username}).exec()
}

//procura um utilizador por email
function getUserByEmail(email){
    return User.findOne({email: email}).exec()
}

//cria um novoutilizador
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

function updateUser(id, newUser){
    return User
    .updateOne({ _id: id }, newUser)
}


function updateUserByUsername(username, newUser){
    return User.updateOne({username:username}, {"$set": newUser})
}

function removeUserByUsername(username){
    return getUserByName(username).then(user => {
        console.log(user)
        var regex = new RegExp(`"user\":\"${user._id}\"`)
        Session.deleteMany({ "session": regex }).then( 
            Resource.deleteResourceFromUser(username).then(
                () => User.deleteOne({username:username})
            )
        )
    })
}

module.exports.listUsers = listUsers;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getUserByName = getUserByName;
module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.lookUp = lookUp;
module.exports.updateUser= updateUser;
module.exports.updateUserByUsername = updateUserByUsername;
module.exports.removeUserByUsername = removeUserByUsername;