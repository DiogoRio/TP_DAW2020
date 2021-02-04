var axios = require("axios")
var fs = require("fs")
var path = require('path');
var baseDir = path.resolve(__dirname, '..')


usersDir = baseDir + "/datasets/users.json"
let rawJson = fs.readFileSync(usersDir);
let users = JSON.parse(rawJson);


function sendRequests(){
   for(let i = 0; i < users.length; i++){
        axios.post('http://localhost:7000/users/register', {
            username: users[i].username,
            name: users[i].name,
            email: users[i].email,
            password: users[i].password,
            location: users[i].location,
            department: users[i].department,
            course: users[i].course,
        })
            .then(console.log("Enviado aluno"))
            .catch(e => {console.log(e)})
    }
}

sendRequests()




