var directions = [0, 0, 0, 0, 0, 0]
var selectedDepart = "";
var departCourses = [];
var selectedCourse = "";

function filterTable(){
    var input, filter, table, tr, td, i, username, name;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("usersTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "";
    }
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        td1 = tr[i].getElementsByTagName("td")[1];
        td3 = tr[i].getElementsByTagName("td")[3];
        td4 = tr[i].getElementsByTagName("td")[4];
        if (td) {
            username = td.textContent || td.innerText;
            name = td1.textContent || td1.innerText;
            depart = td3.innerHTML.toLowerCase();
            course = td4.innerHTML.toLowerCase();
            if (username.toUpperCase().indexOf(filter) > -1 || name.toUpperCase().indexOf(filter) > -1) {
                if(selectedDepart.length > 0){
                    if(selectedDepart != depart){
                        tr[i].style.display = "none";    
                    }
                }
                if(selectedCourse.length > 0){
                    if(selectedCourse != course){
                        tr[i].style.display = "none";    
                    }
                }
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
/*
function filterNames() {
    var input, filter, table, tr, td, i, username, name;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("usersTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        td1 = tr[i].getElementsByTagName("td")[1];
        if (td) {
            username = td.textContent || td.innerText;
            name = td1.textContent || td1.innerText;
            if (username.toUpperCase().indexOf(filter) > -1 || name.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    filterUsers();
}*/

function sort(coluna) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("usersTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        // comecar no 1 para ignorar as th
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[coluna];
            y = rows[i + 1].getElementsByTagName("td")[coluna];
            if (directions[coluna] == 0) {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    if (directions[coluna] == 0) {
        directions[coluna] = 1;
    } else {
        directions[coluna] = 0;
    }
}
/*
function filterUsers(){
    table = document.getElementById("usersTable");
    tr = table.getElementsByTagName("tr");
    if(selectedDepart.length == 0){
        for (i = 1; i < tr.length; i++) {
            tr[i].style.display = "";
        }
    }else{
        for (i = 1; i < tr.length; i++) {
            depart = tr[i].getElementsByTagName("td")[3].innerHTML.toLowerCase();
            if(selectedDepart == depart){
                tr[i].style.display = "";
            }else{
                tr[i].style.display = "none";
            }
        }
    }
    if(selectedCourse.length > 0){
        for (i = 1; i < tr.length; i++) {
            course = tr[i].getElementsByTagName("td")[4].innerHTML.toLowerCase();
            if(selectedCourse == course){
                tr[i].style.display = "";
            }else{
                tr[i].style.display = "none";
            }
        }
    }

}*/

function setDepartFilter(id, dep){
    if(dep == "All"){
        selectedDepart = "";
        filterTable();
    }else{
        d = dep.toLowerCase();
        if(selectedDepart != d){
            selectedDepart = d;
            filterTable();
        }
    }
}

function setCourseFilter(id, course){
    if(course == "All"){
        selectedCourse = "";
        filterTable();
    }else{
        c = course.toLowerCase();
        if(selectedCourse != c){
            selectedCourse = c;
            filterTable();
        }
    }
}

function setDepartCourses(courses){
    if(courses == "empty"){
        departCourses = [];
    }else{
        departCourses = courses.split(',');
    }
    filterCourseOptions();
}


function filterCourseOptions(){
    select = document.getElementById("course");
    options = select.getElementsByTagName("option")
    if(departCourses.length > 0){
        // ignorar a option "all"
        for(i=1; i<options.length; i++){
            if(!departCourses.includes(options[i].value)){
                options[i].style.display = "none";
            }else{
                options[i].style.display = "";
            }
        }
    }else{
        // ignorar a option "all"
        for(i=1; i<options.length; i++){
            options[i].style.display = ""; 
        }
    }
}
