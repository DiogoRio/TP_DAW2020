function filterUsers() {
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
    
}