var reg_selectedDepart = "";
var reg_departCourses = [];
var reg_selectedCourse = "";


function reg_setDepartFilter(id, dep){
    d = dep.toLowerCase();
    if(reg_selectedDepart != d){
        reg_selectedDepart = d;
    }
}

function reg_setCourseFilter(id, course){
    c = course.toLowerCase();
    if(reg_selectedCourse != c){
        reg_selectedCourse = c;
    }
}

function reg_setDepartCourses(courses){
    reg_departCourses = courses.split(',');
    reg_filterCourseOptions();
}


function reg_filterCourseOptions(){
    selected = false;
    select = document.getElementById("course");
    options = select.getElementsByTagName("option")
    if(reg_departCourses.length > 0){
        for(i=0; i<options.length; i++){
            if(!reg_departCourses.includes(options[i].attributes.name.value)){
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