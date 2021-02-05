var edit_selectedDepart = "";
var edit_departCourses = [];
var edit_selectedCourse = "";


function edit_setDepartFilter(id, dep){
    d = dep.toLowerCase();
    if(edit_selectedDepart != d){
        edit_selectedDepart = d;
    }
    console.log("here -> selectedDepart: ", edit_selectedDepart)
}

function edit_setCourseFilter(id, course){
    c = course.toLowerCase();
    if(edit_selectedCourse != c){
        edit_selectedCourse = c;
    }
}

function edit_setDepartCourses(courses){
    edit_departCourses = courses.split(',');
    edit_filterCourseOptions();
}


function edit_filterCourseOptions(){
    selected = false;
    select = document.getElementById("course");
    options = select.getElementsByTagName("option")
    if(edit_departCourses.length > 0){
        for(i=0; i<options.length; i++){
            if(!edit_departCourses.includes(options[i].attributes.name.value)){
                options[i].style.display = "none";
            }else{
                if(!selected){
                    options[i].selected = 'selected'
                    selected = true
                }
                options[i].style.display = "";
            }
        }
    }else{
        for(i=0; i<options.length; i++){
            options[i].style.display = ""; 
        }
    }
}