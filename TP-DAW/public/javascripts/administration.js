function createCourse(depid,designation){
    axios.post(`/administration/depart/${depid}/add`,{
        designation:designation
    })
    .then(() => window.location.assign('/administration/departs'))
    .catch(error => console.log(error));
}

//Filtros para o modal de edição de utilizadores
var adm_selectedDepart = "";
var adm_departCourses = [];
var adm_selectedCourse = "";


function adm_setDepartFilter(id, dep){
    d = dep.toLowerCase();
    if(reg_selectedDepart != d){
        reg_selectedDepart = d;
    }
}

function adm_setCourseFilter(id, course){
    c = course.toLowerCase();
    if(adm_selectedCourse != c){
        adm_selectedCourse = c;
    }
}

function adm_setDepartCourses(courses){
    adm_departCourses = courses.split(',');
    adm_filterCourseOptions();
}


function adm_filterCourseOptions(){
    selected = false;
    select = document.getElementById("edit-course");
    options = select.getElementsByTagName("option")
    if(adm_departCourses.length > 0){
        for(i=0; i<options.length; i++){
            if(!adm_departCourses.includes(options[i].attributes.name.value)){
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