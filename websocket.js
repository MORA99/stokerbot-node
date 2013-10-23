var sm = require('./backend/sensorManager.js');

var listeners = new Array();

exports.addListener = function(soc)
{
	listeners.push(soc);
	soc.emit("sensor.load", sm.list());

        soc.on('disconnect', function () {

		var i = listeners.indexOf(soc);
		if(i != -1) {
			listeners.splice(i, 1);
		}
	});
}

sendSensor = function(sensor) {
	if (sensor != undefined && sensor.host == '')
	{
		listeners.forEach(function(entry){
		  entry.emit('sensor.update', { "id": sensor.name, "value": sensor.value });
		});
	}
}

sendSensorList = function()
{
        listeners.forEach(function(entry){
          entry.emit('sensor.load', sm.list());
        });
}

//Keep sensor time updated even if no change
setInterval(sendSensorList, 30000);



sm.events.on("newSensor", function(sensor) { sendSensor(sensor); });
sm.events.on("sensorChange", function(sensor, oldvalue) { sendSensor(sensor); });
sm.events.on("sensorsDeleted", function(pruned) { sendSensorList(); });
