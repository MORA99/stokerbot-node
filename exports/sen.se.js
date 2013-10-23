var net = require('net');
var http = require('http');
var request = require('request');

var sm = require('../backend/sensorManager.js');

var changed = false;

sendSensors = function() {
	if (changed)
	{
		//console.log("Posting to se.se");
		var sdata = new Array();
		sdata.push({'feed_id':43953,'value':sm.get("28-000003F96C24").value});
                sdata.push({'feed_id':43954,'value':sm.get("28-000003F951F3").value});
                sdata.push({'feed_id':43955,'value':sm.get("DI1").value});
                sdata.push({'feed_id':43956,'value':sm.get("DI2").value});
                sdata.push({'feed_id':43957,'value':sm.get("DI3").value});
                sdata.push({'feed_id':43958,'value':sm.get("DI4").value});


		request.post(
		    'http://api.sen.se/events/',
		    { 
			headers: {'sense_key':'9e2CSIMLFP-yAywntOXHVA'},
			json: sdata
		    },
		    function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		            //console.log(body)
		        } else {
	                    //console.log("ERROR", body);
			}
		    }
		);
	}
}


setInterval(sendSensors, 30000);
sm.events.on("newSensor", function(sensor) { changed = true; });
sm.events.on("sensorChange", function(sensor, oldvalue) { changed = true; });
