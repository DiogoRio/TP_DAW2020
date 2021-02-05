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
        var types = await ResourceType.getAll()
        renderNewPage(res, new Resource(), types)
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
            res.render('resources/editResource', {resource:resource, types:types})
        }
        catch{
            console.log('Erro ao aceder pagina de editar recurso')
            res.render('errors/editResourcePageError')
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
         // console.log("Resource update")
            res.redirect('/myaccount')
        }
        catch{
            console.log('Erro ao editar recurso')
            res.render('errors/editResourceError')
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
            console.log('Erro ao aceder à pagina dos recursos do user')
            res.render('errors/userResourcesError')
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
            console.log('Erro ao aceder à pagina do recurso')
            res.render('errors/resourcePageError')
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
            console.log('Erro ao aceder à pagina dos recursos')
            res.render('errors/resourcesPageError')
        }
      }else{
        res.redirect('/users/login')
      }
});


router.post('/:id/addComment', async (req, res) => {
    if(req.isAuthenticated()){ 
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
            console.log('Erro ao comentar o recurso')
            res.render('errors/commentError')
        }
    }
    else{
        res.redirect('/users/login')
    } 

})

router.post('/:id/deleteComment/:idC', async (req, res) => {
    if(req.isAuthenticated()){        
        var idC = req.params.idC
        //console.log(idC)
        try{
            await Res.deleteComment(req.params.id, idC)
            res.redirect(`/resources/${req.params.id}/`)
            }
        catch{
            console.log('Erro ao eliminar comentário sobre o recurso')
            res.render('errors/commentDeleteError')
        }
    }
    else{
        res.redirect('/users/login')
    } 
});

router.post('/:id/addRating', async (req, res) => {
    if(req.isAuthenticated()){
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
            console.log('Erro ao classificar recurso')
            res.render('errors/ratingError')
        }
    }
    else{
        res.redirect('/users/login')
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
            console.log('Erro ao eliminar recurso')
            res.render('errors/deleteError')
        }
    }
    else{
        res.redirect('/users/login')
    } 
})

function renderNewPage (res, resource, types , hasError = false){
    try{
        const params = {
            resource : resource,
            auth: true,
            types:types
        }
        if (hasError){
            console.log('Erro no download')
            res.render('errors/downloadError')
        }
        res.render('resources/new', params)
    }
    catch{
        console.log('Erro registar recurso')
        res.render('errors/registerResourceError') 
    }
}


router.post("/", upload.single("cover"), async (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.file)
        if (req.file != null) {
            if (req.file.mimetype == 'application/zip') {
                SIP.unzip(req.file.path);
                if (CheckManifesto.check(__dirname + '/../' + req.file.path + 'dir')) {
                    //console.log(__dirname + '/../' + req.file.path + 'dir')
                   
                    var d = new Date().toISOString().substr(0, 16);
                    var jsonObj = __dirname + '/../' + req.file.path + 'dir' + '/manifesto.json'
                    req.body.manifesto = JSON.stringify(require(jsonObj));
                    
                    let quarenPath = __dirname + '/../' + req.file.path + 'dir'
                    //console.log(quarenPath)
                    let dirpath = __dirname + "/../public/fileStore/" +  req.user.username 
                    //console.log(dirpath)
                    fs.mkdirSync(dirpath, {recursive: true})

                    let newPath = dirpath + "/" + req.file.originalname.split('.')[0] + d
                    //console.log(newPath)
                    fs.rename(quarenPath, newPath, function (error) {
                        if (error) {
                            console.log('Erro no download')
                            res.render('errors/uploadError')
                        }
                    })

                    //console.log(newPath)

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
                    res.render('errors/manifestoError')
                }
            } 
            else {
                console.log('Ficheiro nao suportado')
                RmFolder.rmfolder(__dirname + '/../' + req.file.path + 'dir');
                fs.unlinkSync(req.file.path);
                res.render('errors/noFileSuport')
            }
        } 
        else {
            console.log('Sem ficheiro')
            res.render('errors/noFile')
        }
    }
    else {
        console.log('Nao autenticado')
        res.redirect("/users/login")
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
                    console.log('Erro no download')
                    res.render('errors/downloadError')
                }
            })

            res.download(newPath, function (error) {
                fs.rmSync(newPath);
                if (error) {
                    console.log('Erro no download')
                    res.render('errors/downloadError')
                }
                //console.log('removido')
              })
         }
        catch{
            console.log('Erro no download')
            res.render('errors/downloadError')
        }
    }
    else{
        res.redirect('/users/login')
    } 
})
  

module.exports = router;