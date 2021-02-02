var fs = require('fs');

rmfolders = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var currPath = path + "/" + file;
            if (fs.lstatSync(currPath).isDirectory()) {
                rmfolders(currPath);
            } else {
                fs.unlinkSync(currPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports.rmfolder = function (path) {
    rmfolders(path)
}