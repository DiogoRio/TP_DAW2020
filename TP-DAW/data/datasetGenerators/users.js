var fs = require("fs")
var path = require('path');
const depart = require("../../models/depart");
var baseDir = path.resolve(__dirname, '..')
locations = ["Viana do Castelo", "Braga", "Porto", "Aveiro", "Coimbra", "Leiria", "Lisboa", "Faro", "Beja", "Madeira", "Açores"]
departs = JSON.parse(fs.readFileSync(baseDir + "/datasets/departamentos.json"))


function generateUsername(name){
    var result = "";
    var name_split = name.split(" ");
    for(let i=0; i<name_split.length; i++){
        result += name_split[i][0].toLowerCase();
    }
    result += Math.floor(Math.random() * 1000).toString().padStart(4, '0');
    return result
}

function generateCourseId(dept_num){
    var count = 0;
    for(let i=0; i<dept_num; i++){
        count += departs[i].courses.length
    }
    var num_courses = departs[dept_num].courses.length
    return "C" + (Math.floor(Math.random() * num_courses) + count).toString().padStart(6, '0');
}

function createUserDataset(){
    users = "[\n"
    var names = JSON.parse(fs.readFileSync("nomes.json"));
    for(let i = 0; i < names.names.length; i++){
        username = generateUsername(names.names[i]);
        dept_num = Math.floor(Math.random() * departs.length)
        department = "D" + dept_num.toString().padStart(6, '0');
        course = generateCourseId(dept_num)
        user = {
            username: username,
            email: username + "@gmail.com",
            name: names.names[i],
            location: locations[Math.floor(Math.random() * locations.length)],
            department: department,
            course: course
        }
        if(i < names.names.length -1)
            users += "\t" + JSON.stringify(user) + ",\n"
        else
            users += "\t" + JSON.stringify(user) + "\n]"
    }
    fs.writeFile(baseDir + "/datasets/users.json", users, function (err) {
        if (err) return console.log("Erro a criar ficheiro users.json" + err);
    })
}

createUserDataset();