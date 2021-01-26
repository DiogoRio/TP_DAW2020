// Department controller
var Depart = require('../models/depart')

// List all departments
function listDeparts(){
    return Depart
        .find()
        .select('-_id id designation courses')
        .sort({id:1})
        .exec()
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
module.exports.addDepart = addDepart
module.exports.addCourse = addCourse