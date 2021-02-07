//User Controller

var User = require('../models/user')
var Session = require('../models/session')
var Resource = require('./resource')
const { model } = require('../models/user')
const { use } = require('../routes')
const passwordUtils = require('../lib/passwordUtils')
const { pass } = require('../config/db')


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
        var regex = new RegExp(`"user\":\"${user._id}\"`)
        Session.deleteMany({ "session": regex }).then( 
            Resource.deleteResourceFromUser(username).then(
                () => User.deleteOne({username:username})
            )
        )
    })
}

function grantAdminPriviledges(username){
    console.log("username:" + username)
    return User.updateOne({username:username},{$set : {type:"admin"}})

}

function removeAdminPriviledges(username){
    return User.updateOne({username:username},{$set : {type:"user"}})
}

function alterPassword(username, password){
    const saltHash = passwordUtils.genPassword(password)

    const salt = saltHash.salt
    const hash = saltHash.hash
    console.log("username: " + username + "; new password: " + password + "; newHash: " + hash + "; newSalt: " + salt)
    return User.findOneAndUpdate({username:username}, {$set: {hash:hash, salt:salt}}).exec()
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
module.exports.grantAdminPriviledges = grantAdminPriviledges;
module.exports.removeAdminPriviledges = removeAdminPriviledges;
module.exports.alterPassword = alterPassword;