var http = require('http');
var FormData = require('form-data')
var fs = require('fs')
var path = require('path');
var baseDir = path.resolve(__dirname, '..')
var cookie = ''

usersDir = baseDir + "/datasets/users.json"
let rawJson = fs.readFileSync(usersDir);
let users = JSON.parse(rawJson);
var types_files = [{type: "Report", filename: "report.zip"}, {type: "Application", filename: "express_app.zip"},
{type: "Slides", filename: "slidesDM.zip"}, {type: "Thesis", filename: "thesisGuidelines.zip"},
{type: "Evaluation", filename: "evaluationCC.zip"}, {type: "Solved Problem", filename: "solvedProb.zip"}]
var dates = ["2020-04-13", "2020-10-25", "2020-06-30", "2020-08-02", "2020-09-13", "2020-12-20",
 "2020-12-31","2021-01-01", "2021-01-13", "2021-01-02"]



function sendReq(credentials, resourceName, title, type, creDate, desc){

    filePath = baseDir + "/resources/" + resourceName

    var post_options = {
        host: 'localhost',
        path: '/users/login',
        port: '7000',
        method: 'POST',
        headers: {'Content-Type': "application/json"}
    };


    callback = function(response) {
        var formData = new FormData();
        formData.append("title", title)
        formData.append("typeR", type)
        formData.append("creDate", creDate)
        formData.append("description", desc)
        formData.append("visibility", "Public")
        formData.append("cover", fs.createReadStream(filePath), resourceName)
        cookie = response.rawHeaders[11]
        formHeaders = formData.getHeaders()
        var post_options2 = {
            host: 'localhost',
            path: '/resources',
            port: '7000',
            method: 'POST',
            headers: {'content-type': formHeaders['content-type'], 'cookie': cookie},
            data: formData
        };
        var req2 = http.request(post_options2, null);
        formData.pipe(req2)
    }

    var req = http.request(post_options, callback);
    req.write(JSON.stringify(credentials))
    req.end();

}

//Upload de 60 recursos diferentes. (10 utilizadores, 6 recursos de cada tipo) 

for(let i = 0; i < 10; i++){
    for(let j = 0; j < 6; j++){
        credentials = {
            username: users[i].username,
            password: "123"
        }
        title = users[i].username + "\'s " + types_files[j].type
        sendReq(credentials, types_files[j].filename, title, types_files[j].type, 
            dates[Math.floor(Math.random() * dates.length)], "My first " + types_files[j].type + "!")
    }
}

