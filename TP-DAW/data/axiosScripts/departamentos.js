var axios = require("axios")
var fs = require("fs")
var path = require('path');
var baseDir = path.resolve(__dirname, '..')


departsDir = baseDir + "/datasets/departamentos.json"
let rawJson = fs.readFileSync(departsDir);
let departs = JSON.parse(rawJson);


// await para os pedidos a API nao irem ao mesmo tempo e nao haver conflitos na criacao dos ids
// os ids sao criados foram da bd, logo a sua criacao nao e atomica
async function sendRequests(departs){
    for(i = 0; i < departs.length; i++){
        await axios.post('http://localhost:7000/administration/add/depart', {designation: departs[i].designation})
        var departId = "D" + i.toString().padStart(6, '0');
        for(j = 0; j < departs[i].courses.length; j++){
            await axios.post('http://localhost:7000/administration/depart/' + departId + '/add', {designation: departs[i].courses[j]})
        }
    }
}

sendRequests(departs)




