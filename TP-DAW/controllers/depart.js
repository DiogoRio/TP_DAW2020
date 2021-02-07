// Department controller
var Depart = require('../models/depart')

// List all departments
function listDeparts(){
    return Depart
        .find()
        .select('-_id id designation courses')
        .sort({designation:1})
        .exec()
}

// List all courses
async function listCourses(){
    var departs = await listDeparts()
    var result = []
    for(i = 0; i < departs.length; i++){
        for(j = 0; j < departs[i].courses.length; j++){
            course = JSON.parse(JSON.stringify(departs[i].courses[j]))
            result.push({id: course.id, designation: course.designation})
        }
    }
    return result.sort((a, b) => a.designation > b.designation ? 1 : -1);
}

// Count departs
function numDeparts(){
    return Depart
        .countDocuments()
        .exec()
}

// Count courses
async function numCourses(){
    var count = 0;
    var departs = await listDeparts()
    for(i = 0; i < departs.length; i++){
        count += departs[i].courses.length;
    }
    return count;
}

async function getDepById(id){
    var departs = await listDeparts()
    for (i = 0; i < departs.length; i++) {
        if(departs[i].id == id){
            return departs[i]
        }
    }
}

async function getCourseById(id){
    var courses = await listCourses()
    for (i = 0; i < courses.length; i++) {
        if(courses[i].id == id){
            return courses[i]
        }
    }
}


// Add department to database
async function addDepart(des){
    var dep_num = await numDeparts()
    console.log(await numCourses());
    var dep_num_str = dep_num.toString().padStart(6, '0'); // numero de departamentos representado em 6 digitos
    //ex: 6 -> 000006
    const depart = new Depart({
        id: "D" + dep_num_str,
        designation: des,
        courses: []
    })
    return depart.save()
}

function deleteDepart(id){
    return Depart.deleteOne({id:id})
}

// Add course to department
async function addCourse(departId, courseDes){
    var num_courses = await numCourses();
    var num_courses_str = num_courses.toString().padStart(6, '0');
    return Depart.updateOne({id: departId}, {$push: {courses: {id: "C" + num_courses_str, designation: courseDes}}})   
}

module.exports.listDeparts = listDeparts
module.exports.listCourses = listCourses
module.exports.getDepById = getDepById
module.exports.getCourseById = getCourseById
module.exports.addDepart = addDepart
module.exports.addCourse = addCourse
module.exports.deleteDepart = deleteDepart