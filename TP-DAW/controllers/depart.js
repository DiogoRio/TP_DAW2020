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

// Add department to database
function addDepart(id, des){
    const depart = new Depart({
        id: id,
        designation: des,
        courses: []
    })
    depart.save()
}

// Add course to department
function addCourse(departId, courseId, courseDes){
    return Depart.updateOne({id: departId}, {$push: {courses: {id: courseId, designation: courseDes}}})   
}

module.exports.listDeparts = listDeparts
module.exports.listCourses = listCourses
module.exports.addDepart = addDepart
module.exports.addCourse = addCourse