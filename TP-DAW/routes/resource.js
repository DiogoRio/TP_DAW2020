var express = require('express')
var router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Resource = require('../models/resource')
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
            res.render('resources/resources', {
                resources: resources
            })
        }catch{
            res.redirect('/')
        }
      }else{
        res.redirect('/users/login')
      }
});


router.get('/new', async(req, res) => {
    if(req.isAuthenticated()){  
        renderNewPage(res, new Resource())
    }else{
        res.redirect('/users/login')
    }     
});


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
    })

    try{
        const newResource = await resource.save()
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