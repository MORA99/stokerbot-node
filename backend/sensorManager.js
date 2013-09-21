/*
sm.events.on("newSensor", function(id, value) { console.log("New sensor: "+id); });
sm.events.on("sensorUpdate", function(id, value) { console.log("Sensor update: "+id+" ("+value+")"); });
sm.events.on("sensorChange", function(id, oldvalue, newvalue) { console.log("Sensor change: "+id+" ("+oldvalue+" => "+newvalue+")"); });
*/


function Sensor(id, value, time) {
  this.id    = id;
  this.value = value;
  this.time  = time;
}

var sensors = new Array();
var events = require('events');
var util   = require('util');
 
exports.events = new events.EventEmitter;

exports.add = function(id, value)
{
	var sensor = exports.get(id);
	if (sensor == null)
	{
		sensors.push(new Sensor(id, value, new Date()));
                exports.events.emit('newSensor', id, value);
	}
	else
	{
		var oldvalue = sensor.value;
		sensor.value = value;
		sensor.time = new Date();

                exports.events.emit('sensorUpdate', id, value);
                if (value != oldvalue) exports.events.emit('sensorChange', id, oldvalue, value);
	}
}

//Sensor lives, but no data avaliable (avoid purge)
exports.ping = function(id)
{
	var sensor = exports.get(id);
	sensor.time = new Date();
	exports.events.emit('sensorUpdate', id, sensor.value);
}

exports.get = function(id)
{
	var res = null;
	sensors.forEach(function(entry) {
		if (entry.id == id)
			res=entry;
	});
	return res;
}

exports.list = function()
{
	return sensors;
}

exports.prune = function(secs)
{
	//Deletes sensors not seen in secs seconds
	var newArray = sensors.slice(0);
	sensors = new Array();
	var n = new Date();
	var pruned = 0;

	newArray.forEach(function(entry){
		var diff = (n.getTime() - entry.time.getTime()) / 1000;
		if (diff < secs)
			sensors.push(entry);
		else
			pruned++;
	});
	if (pruned > 0)
	        exports.events.emit('sensorsDeleted', pruned);
}


setInterval(function(){exports.prune(60);},60000);


