function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

window.onload = function () {

    axios.get("/administration/doughnut").then( (datap) => {

        var total = 0;
        datap.data.forEach( e => {
            total += e.y;
        })

        datap.data.forEach(d => {
            var tmp = ( d.y / total ) * 100
            d.percent = roundToTwo(tmp)
        });



        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Number of Downloads by Resource",
                fontWeight: "normal"
            },
            data: [{
                type: "doughnut",
                indexLabel: "{type}: {y}",
                toolTipContent: "<b>{type}</b>: {percent}%",
                dataPoints : datap.data
            }]
        });
        chart.render();
    })
	
	axios.get("/administration/piegraphdata").then( (datap) => {

        datap.data.data.forEach(d => {
            var tmp = ( d.y / datap.data.total ) * 100
            d.percent = roundToTwo(tmp)
            
        });

        var chart = new CanvasJS.Chart("chartContainer2", {
            animationEnabled: true,
            title:{
                text: "Types of Resources",
                fontWeight: "normal"
            },
            data: [{
                type: "pie",
                indexLabel: "{label}: {y}",
                toolTipContent: "<b>{label}</b>: {percent}%",
                dataPoints : datap.data.data
            }]
        });
        chart.render();
    })
    
}