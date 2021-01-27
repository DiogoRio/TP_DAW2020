// nota, se alterarem a ordem/numero de colunas da tabela, corrigir indices nas funcoes abaixo 
var filter_types = [];
nameDir = 0;
regDateDir = 0;
pointsDir = 0;
function printDate() {

}
function filterByType() {
    f_types = []
    types = document.getElementById("types")
    inputs = types.getElementsByTagName("input")
    for (i = 0; i < inputs.length; i++) {
        if (!inputs[i].checked) {
            f_types.push(inputs[i].name)
            console.log("Added " + inputs[i].name)
        }
    }
    filter_types = f_types;
    filterResources();
}

function filterResources() {
    var input, filter, table, tr, td, i, name, type;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("resourceTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        td1 = tr[i].getElementsByTagName("td")[1];
        if (td) {
            name = td.textContent || td.innerText;
            type = (td1.textContent || td1.innerText);
            if (name.toUpperCase().indexOf(filter) > -1 && !filter_types.includes(type)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function sortByName() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("resourceTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        // comecar no 1 para ignorar as th
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[0];
            y = rows[i + 1].getElementsByTagName("td")[0];
            if (nameDir == 0) {
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
    if (nameDir == 0) {
        nameDir = 1;
    } else {
        nameDir = 0;
    }
}


function sortByPoints() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("resourceTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        // comecar no 1 para ignorar as th
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[5];
            y = rows[i + 1].getElementsByTagName("td")[5];
            if (pointsDir == 0) {
                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
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
    if (pointsDir == 0) {
        pointsDir = 1;
    } else {
        pointsDir = 0;
    }
}

function sortByDate(index) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("resourceTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        // comecar no 1 para ignorar as th
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[index];
            y = rows[i + 1].getElementsByTagName("td")[index];
            if (regDateDir == 0) {
                if (Date.parse(x.innerHTML) < Date.parse(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (Date.parse(x.innerHTML) > Date.parse(y.innerHTML)) {
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
    if (regDateDir == 0) {
        regDateDir = 1;
    } else {
        regDateDir = 0;
    }
}
