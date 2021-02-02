var AdmZip = require('adm-zip');
const fs = require('fs');

module.exports.unzip = (file) => {
    var dest = file + 'dir'

    fs.mkdirSync(dest);

    var unzipAux = new AdmZip(file);
    unzipAux.extractAllTo(dest, false);

    fs.unlinkSync(file);
}

module.exports.zip = (path) => {
    var zip = new AdmZip();

    fs.readdirSync(path).forEach((file) => {
        if (fs.lstatSync(path + "/" + file).isDirectory()) {
            zip.addLocalFolder(path + "/" + file + "/");
        } else {
            zip.addLocalFile(path + "/" + file);
        }
    });

    zip.writeZip(path + "dir");
}