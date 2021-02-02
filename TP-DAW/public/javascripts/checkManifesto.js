var fs = require('fs')

module.exports.check = (path) => {
    var manifesto = path + '/manifesto.json'

    try {
        if (fs.existsSync(manifesto)) {
            try{ 
                var file = require(manifesto)
            }
            catch{
                console.log("Manifesto nao existe");
                return false;
            }
            if (checkFolder(path + '/data/', file)){
                return true;
            }
    }
    } catch(err) {
        console.error(err)
    }
    return false ;
}

checkFolder = (currentDir, folder) => {
    var flag = true;
    
    folder.files.forEach((file) => {
        if (!(checkFile(currentDir, file))) {
            flag = false;
        }
    })

    if (flag) {
        folder.folders.forEach((p) => {
            if (!(fs.existsSync(currentDir + p.title))) {
                flag = false
            }
            else {
                if (!(checkFolder(currentDir + p.title + '/', p.content))){
                    flag = false
                } 
            }
        })
    }
    return flag;
}

checkFile = (currentPath, file) => {
    try {
        if (fs.existsSync(currentPath + file.title + '.' + file.type)) {
            return true;
        }
        else{
            return false;
        } 
    } catch (err) {
        console.error(err);
    }
    return false;
}