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

        userController
        .createUser(req.body.username,req.body.email,req.body.name,req.body.location,
            req.body.department, req.body.course,hash,salt)
        News.addNewUserNew(req.body.username,req.body.name)
        res.redirect('/users/login')
    }
}

async function register_admin(){
    if( !(await userController.getUser("admin")) ){
        const saltHash = passwordUtils.genPassword("admin")

        const salt = saltHash.salt
        const hash = saltHash.hash
        userController.createUser("admin","admin","admin","NONE",
            "ADMIN", "ADMIN",hash,salt)
    }
    userController.grantAdminPriviledges("admin")
}

module.exports.register = register;
module.exports.register_admin = register_admin;