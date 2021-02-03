const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Resource = require('../models/resource')
const News = require('../controllers/news')
const Res = require('../controllers/resource')
const RmFolder = require('../public/javascripts/rmFolder')
const SIP = require('../public/javascripts/sip')
const CheckManifesto = require('../public/javascripts/checkManifesto')
const { use } = require('passport')
const { toNamespacedPath } = require('path')
const { setupMaster } = require('cluster')
const uploadPath = path.join('public',Resource.resResource)
const upload = multer({dest: "uploads/"});
var ResourceType = require('../controllers/resourceType');



//const upload = multer({
//    dest: uploadPath,
//    fileFilter: (req, file, callback) => {
//        console.log(file.originalname)
//        if(!file.originalname.match(/\.(txt|png|pdf)$/))
//            return callback(new Error('File Format Incorrect')) 
//        callback(undefined, true)
//    }
//})

router.get('/new', async(req, res) => {
    if(req.isAuthenticated()){
        renderNewPage(res, new Resource())
    }else{
        res.redirect('/users/login')
    }     
});


router.get('/edit/:id',async (req, res, next) => {
    if(req.isAuthenticated()){
        try{
            var id = req.params.id;
            //console.log(req.params.id)
            var resource = await Res.lookup(id)
            var types = await ResourceType.getAll()
            //.log(resource)
            res.render('resources/editResource', {resource:resource, types:types})
        }
        catch{
          const html = '<p>Ocorreu um erro</p>';
          res.send(html);
        }
    }
    else{
        res.redirect('/users/login')
    }  
});
  
router.post("/edit/:id", async (req, res, next) => {
    if(req.isAuthenticated()){
        try{
            var id = req.params.id;
            await Res.updateResource(id, req.body)
         //   console.log("Resource update")
            res.redirect('/myaccount')
        }
        catch{
          const html = '<p>Nao foi possivel efetuar a mudança</p>';
          res.send(html);
        }
    }
    else{
        res.redirect('/users/login')
    } 
})

router.get('/user/:username', async(req, res) => {
    if(req.isAuthenticated()){
        try{
            const author = req.params.username
            const resource = await Res.lookupByAuthor(req.params.username)
            const userLog = req.user.username
            res.render('resources/resourcesOfUser', {
                res: resource,
                auth: true,
                userLog: userLog,
                author : author
            })
        }catch{
            res.redirect('/')
        }
      }else{
        res.redirect('/users/login')
      }
});

router.get('/:id', async(req, res) => {
    if(req.isAuthenticated()){
        try{
            const resource = await Res.lookup(req.params.id)
            console.log(resource)
            const userLog = req.user.username
            res.render('resources/resource', {
                res: resource,
                auth: true,
                userLog: userLog,
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
                user : user,
                auth: true 
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

router.post('/:id/deleteComment/:idC', async (req, res) => {
    var idC = req.params.idC
    //console.log(idC)
    try{
        await Res.deleteComment(req.params.id, idC)
        res.redirect(`/resources/${req.params.id}/`)
        }
    catch{
        res.redirect('/')
    }
});

router.post('/:id/addRating', async (req, res) => {
    //provavelmente adiconar isAuthenticated
    let ratings = await Res.lookupPoints(req.params.id, req.user.username);
    let tmp = ratings.points
    try{
        if(tmp.length == 0){
            let ratingSchema = {}
            ratingSchema.author = req.user.username
            ratingSchema.point = req.body.point

            await Res.addRating(req.params.id, ratingSchema)
            const points = await Res.lookupResourcePoints(req.params.id)
                let r =0;
                for(let i = 0; i< points.points.length; i++){
                    r += points.points[i].point
                }
            await Res.updatePoints(req.params.id,r)
            console.log('ADD RATING NOVO')
            res.redirect(`/resources/${req.params.id}/`)
        }
        else{
            console.log(ratings.points)
            let ratingSchema = {}
            ratingSchema._id = ratings.points[0]._id
            ratingSchema.author = req.user.username
            ratingSchema.point = parseInt(req.body.point)
            await Res.ratingResource(req.params.id,ratings.points[0]._id)
            await Res.addRating(req.params.id, ratingSchema)
            const points = await Res.lookupResourcePoints(req.params.id)
                let r =0;
                for(let i = 0; i< points.points.length; i++){
                    r += points.points[i].point
                }
            await Res.updatePoints(req.params.id, r)
            console.log('RATING REPLACE')
            res.redirect(`/resources/${req.params.id}/`)
        }
    }
    catch{
        res.redirect('/')
    }
})

router.delete("/delete/:id", async (req, res, next) => {
    if(req.isAuthenticated()){
        try{
            var id = req.params.id;
            let r =  await Res.lookup(id)
            RmFolder.rmfolder(r.path)
            await Res.deleteResource(id)
            console.log("Resource delete")
            res.sendStatus(200)
        }
        catch{
          const html = '<p>Nao foi possivel efetuar a mudança</p>';
          res.send(html);
        }
    }
    else{
        res.redirect('/users/login')
    } 
})

function renderNewPage(res, resource , hasError = false){
    try{
        const params = {
            resource : resource,
            auth: true 
        }
        if (hasError) params.errorMessage = 'Error Creating Resourse'
        res.render('resources/new', params)
    }
    catch{
        res.redirect('/resources') 
    }
}


router.post("/", upload.single("cover"), async (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.file)
        if (req.file != null) {
            if (req.file.mimetype == 'application/zip') {
                SIP.unzip(req.file.path);
                if (CheckManifesto.check(__dirname + '/../' + req.file.path + 'dir')) {
                    console.log(__dirname + '/../' + req.file.path + 'dir')
                   
                    var d = new Date().toISOString().substr(0, 16);
                    var jsonObj = __dirname + '/../' + req.file.path + 'dir' + '/manifesto.json'
                    req.body.manifesto = JSON.stringify(require(jsonObj));
                    
                    let quarenPath = __dirname + '/../' + req.file.path + 'dir'
                    let dirpath = __dirname + "/../public/fileStore"

                    fs.mkdirSync(dirpath, {recursive: true})

                    let newPath = dirpath + "/" + req.file.originalname.split('.')[0] + d
                    
                    fs.rename(quarenPath, newPath, function (error) {
                        if (error) {
                            console.log("ERROR" + error)
                        }
                    })

                    console.log(newPath)

                    const resource = new Resource({
                          typeR: req.body.typeR,
                          title: req.body.title,
                          creDate: req.body.creDate, 
                          regDate: d, //System Date
                          visibility: req.body.visibility, //Public or Private
                          nameR: req.file.originalname,
                          author: req.user.username,
                          points: [],
                          totalP: 0, //Sistema de upvote/downvote
                          path: newPath,
                          description: req.body.description
                        })

                    
                    await resource.save()
                    News.addNewPostNews(req.user.username, req.body.title)
                    res.redirect(`resources`)
                } 
                else {
                    console.log('Erro no manifesto')
                    RmFolder.rmfolder(__dirname + '/../' + req.file.path + 'dir');
                    res.redirect("/")
                }
            } 
            else {
                console.log('Ficheiro nao suportado')
                RmFolder.rmfolder(__dirname + '/../' + req.file.path + 'dir');
                fs.unlinkSync(req.file.path);
                res.redirect("/")
            }
        } 
        else {
            console.log('Sem ficheiro')
            res.redirect("/")
        }
    }
    else {
        console.log('Nao autenticado')
        res.redirect("/")
    }
});

router.get("/download/:id", async (req, res) => {
    if (req.isAuthenticated()) {
        try{ 
            let data = await Res.lookup(req.params.id)
            //console.log(dados)
            let path = data.path
            SIP.zip(path);
            let quarenPath = path + "dir"
            let dirpath = __dirname + "/../public/tmpStore" 
            
            fs.mkdirSync(dirpath, {recursive: true});
            
            let newPath = dirpath + "/" + data.nameR
            
            fs.rename(quarenPath, newPath, function (error) {
                if (error) {
                    res.status(500).jsonp({error: "Error in the downloads folder"});
                }
            })

            res.download(newPath, function (error) {
                fs.rmSync(newPath);
                if (error) {
                    res.status(500).jsonp({error: "Error in the download"});
                }
                //console.log('removido')
              })
         }
        catch{
            const html = '<p>Nao foi possivel efetuar download</p>';
            res.send(html);
        }
    }
    else{
        res.redirect('/users/login')
    } 
})
  

module.exports = router;