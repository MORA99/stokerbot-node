var net = require('net');
var http = require('http');
var sm = require('../backend/sensorManager.js');

var changed = false;

sendSensors = function() {
	var url = "/update?key=HSQM2U6NOT0EW0M0";

	if (changed)
	{
		console.log("URL: ",url);
		var s = sm.get("28-000003F96C24");
		url += "&field1="+s.value;
                var s = sm.get("28-000003F951F3");
                url += "&field2="+s.value;

                console.log("URL: ",url);

		var options = {
		  host: 'api.thingspeak.com',
		  port: 80,
		  path: url
		};

		http.get(options, function(resp){
		  resp.on('data', function(chunk){
		    //do something with chunk
			console.log(chunk.toString());
		  });
		}).on("error", function(e){
		  console.log("Got error: " + e.message);
		});
	}
}


setInterval(sendSensors, 20000);
sm.events.on("newSensor", function(sensor) { changed = true; });
sm.events.on("sensorChange", function(sensor, oldvalue) { changed = true; });
