const userController = require('../controllers/user')
const passwordUtils = require('../lib/passwordUtils')
const News = require('./news')


async function register(req,res){
    if(await userController.getUserByName(req.body.username)){
        req.flash('error', 'Username already used.')
        console.log('error', 'Username already used.')
        res.redirect('/users/register')
    }
    else if(await userController.getUserByEmail(req.body.email)){
        req.flash('error', 'Email already used.')
        console.log('error', 'Email already used.')
        res.redirect('/users/register')
    }
    else{
        const saltHash = passwordUtils.genPassword(req.body.password)

        const salt = saltHash.salt
        const hash = saltHash.hash
        console.log("salt:" + salt)
        console.log("hash:" + hash)

        userController
        .createUser(req.body.username,req.body.email,req.body.name,req.body.location,
            req.body.department, req.body.course,hash,salt)
        News.addNewUserNew(req.body.username,req.body.name)
        res.redirect('/users/login')
    }
}

module.exports.register = register;