/*
sm.events.on("newSensor", function(id, value) { console.log("New sensor: "+id); });
sm.events.on("sensorUpdate", function(id, value) { console.log("Sensor update: "+id+" ("+value+")"); });
sm.events.on("sensorChange", function(id, oldvalue, newvalue) { console.log("Sensor change: "+id+" ("+oldvalue+" => "+newvalue+")"); });
*/

require('numeral');

function PostProcessor(name, desc, arg1, arg2, arg3, arg4, arg5, fnc)
{
	this.name = name;
	this.desc = desc;
	this.arg1 = arg1;
        this.arg2 = arg2;
        this.arg3 = arg3;
        this.arg4 = arg4;
        this.arg5 = arg5;
	this.fnc = fnc;
}

var postProcessors = new Array();
postProcessors.push(new PostProcessor('Multi', 'Simple multi * 2', '', '', '', '', '', function(val,arg1,arg2,arg3,arg4,arg5) { return val * 2; }));
postProcessors.push(new PostProcessor('Format', 'Format', 'Format (Numeral.js)', '', '', '', '', function(val,arg1,arg2,arg3,arg4,arg5) { return numeral(val).format(arg1); }));

getPostProcessor = function (name) {
	var pp;
	postProcessors.forEach(function (entry) {
		if (name == entry.name) pp=entry;
	}
	);
	return pp;
}

exports.listPostProcessors = function() {
	var arr = new Array();
	postProcessors.forEach(function(entry){
		arr.push({'name':entry.name,'desc':entry.desc,'arg1':entry.arg1,'arg2':entry.arg2,'arg3':entry.arg3,'arg4':entry.arg4,'arg5':entry.arg5});
	});
	return arr;
}

function Sensor(id, value, time) {
  this.id    = id;
  this.value = value;
  this.time  = time;
  this.postprocessor = '';
  this.arg1 = '';
  this.arg2 = '';
  this.arg3 = '';
  this.arg4 = '';
  this.arg5 = '';
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

		if (sensor.postprocessor != "")
		{
			var pp = getPostProcessor(sensor.postprocessor);
			value = pp.fnc(value,sensor.arg1,sensor.arg2,sensor.arg3,sensor.arg4,sensor.arg5);
		}

		sensor.value = value;
		sensor.time = new Date();

                exports.events.emit('sensorUpdate', id, value);
                if (value != oldvalue) exports.events.emit('sensorChange', id, oldvalue, value);
	}
}

exports.config = function(id, postProcessor, arg1, arg2, arg3, arg4, arg5)
{
        var sensor = exports.get(id);
        if (sensor != null)
	{
		sensor.postProcessor = postProcessor;
		sensor.arg1 = arg1;
                sensor.arg2 = arg2;
                sensor.arg3 = arg3;
                sensor.arg4 = arg4;
                sensor.arg5 = arg5;
	}
}

//Sensor lives, but no data avaliable
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

exports.list = function(duration)
{
	if (typeof duration == "undefined") duration = 60;
	var arr = new Array();
        var n = new Date();

        sensors.forEach(function(entry){
                var diff = (n.getTime() - entry.time.getTime()) / 1000;
                if (diff <= duration)
                        arr.push(entry);
        });	

	return arr;
}

/*
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
*/
