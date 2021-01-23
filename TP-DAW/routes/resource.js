var express = require('express')
var router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Resource = require('../models/resource')
const News = require('../controllers/news')
const Res = require('../controllers/resource')
const uploadPath = path.join('public',Resource.resResource)
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        console.log(file.originalname)
        if(!file.originalname.match(/\.(txt|png|pdf)$/))
            return callback(new Error('File Format Incorrect')) 
        callback(undefined, true)
    }
})

router.get('/new', async(req, res) => {
    if(req.isAuthenticated()){
        renderNewPage(res, new Resource())
    }else{
        console.log('CENAS')
        res.redirect('/users/login')
    }     
});

router.get('/:id', async(req, res) => {
    if(req.isAuthenticated()){
        try{
            const resource = await Res.lookup(req.params.id)
            console.log(req.params.id)
            res.render('resources/resource', {
                res: resource
            })
        }catch{
            res.redirect('/')
        }
      }else{
        res.redirect('/users/login')
      }
});

router.get('/', async (req, res) => {
    if(req.isAuthenticated()){
        try{
            const resources = await Resource.find({})
            const user = req.user.username
            //console.log(req.user.username)
            res.render('resources/resources', {
                resources: resources,
                user : user
            })
        }catch{
            res.redirect('/')
        }
      }else{
        res.redirect('/users/login')
      }
});


router.post('/:id/addComment', async (req, res) => {
    //provavelmente adiconar isAuthenticated
    var d = new Date().toISOString().substr(0,16);
    let commentSchema = {}
    commentSchema.date = d
    commentSchema.author = req.user.username
    commentSchema.description = req.body.description
    
    try{
        if(commentSchema.description){
            await Res.addComment(req.params.id, commentSchema)
            res.redirect(`/resources/${req.params.id}/`)
        }
        else{
            res.redirect(`/resources/${req.params.id}/`)
        }
    }
    catch{
        res.redirect('/')
    }
})

router.post('/', upload.single('cover'), async(req, res)=>{
    const fileName = req.file != null ? req.file.originalname : null;
    var d = new Date().toISOString().substr(0,16);
    const resource = new Resource({
      typeR: req.body.typeR,
      title: req.body.title,
      creDate: req.body.creDate, 
      regDate: d, //System Date
      visibility: req.body.visibility, //Public or Private
      nameR: fileName,
      author: req.user.username,
      points: 0 //Sistema de upvote/downvote
    })

    try{
        const newResource = await resource.save()
        News.addNewPostNews(req.user.username, req.body.title)
        res.redirect(`resources`)
    }catch{
        if(resource.nameR != null){
            removeResource(resource.nameR)
        }
        renderNewPage(res, resource, true)
    }
})

function removeResource(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err)
    })
}


function renderNewPage(res, resource , hasError = false){
    try{
        const params = {
            resource : resource
        }
        if (hasError) params.errorMessage = 'Error Creating Resourse'
        res.render('resources/new', params)
    }
    catch{
        res.redirect('/resources') 
    }
}




module.exports = router;