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

sendSensor = function(id, val) {
	listeners.forEach(function(entry){
	  entry.emit('sensor.update', { "id": id, "value": val });
	});
}

sendSensorList = function()
{
        listeners.forEach(function(entry){
          entry.emit('sensor.load', sm.list());
        });
}

//Keep sensor time updated even if no change
setInterval(sendSensorList, 30000);



sm.events.on("newSensor", function(id, value) { sendSensor(id, value); });
sm.events.on("sensorChange", function(id, oldvalue, newvalue) { sendSensor(id, newvalue); });
sm.events.on("sensorsDeleted", function(pruned) { sendSensorList(); });
