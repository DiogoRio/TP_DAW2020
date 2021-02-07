function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

window.onload = function () {

    axios.get("/administration/doughnut").then( (datap) => {
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Numero de Downloads por Recurso"
            },
            data: [{
                type: "doughnut",
                indexLabel: "{type}: {y}",
                toolTipContent: "{y}",
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
                text: "Types of Resources"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                indexLabel: "{label}: {y}",
                legendText: "   {label}: {percent}%   ",
                toolTipContent: "<b>{label}</b>: {percent}%",
                dataPoints : datap.data.data
            }]
        });
        chart.render();
    })
    
}