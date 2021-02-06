function createCourse(depid,designation){
    axios.post(`/administration/depart/${depid}/add`,{
        designation:designation
    })
    .then(() => window.location.assign('/administration/departs'))
    .catch(error => console.log(error));
}

window.onload = function () {
	var chart = new CanvasJS.Chart("chartContainer", {
		title:{
			text: "O QUE METER AQUI?"              
		},
		data: [              
		{
			// Change type to "doughnut", "line", "splineArea", etc.
			type: "column",
			dataPoints: [
				{ label: "apple",  y: 10  },
				{ label: "orange", y: 15  },
				{ label: "banana", y: 25  },
				{ label: "mango",  y: 30  },
				{ label: "grape",  y: 28  }
			]
		}
		]
	});
	chart.render();
	
	axios.get("/administration/piegraphdata").then( (datap) => {

        datap.data.data.forEach(d => {
            d.percent = ( d.y / datap.data.total ) * 100
            console.log(d.y  + " //// " + datap.data.total)
            
        });

        console.log(datap.data)

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