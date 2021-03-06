/*
sm.events.on("newSensor", function(id, value) { console.log("New sensor: "+id); });
sm.events.on("sensorUpdate", function(id, value) { console.log("Sensor update: "+id+" ("+value+")"); });
sm.events.on("sensorChange", function(id, oldvalue, newvalue) { console.log("Sensor change: "+id+" ("+oldvalue+" => "+newvalue+")"); });
*/

var _ = require('underscore');

var nconf = require('nconf');
nconf.file('configuration.json');

nconf.defaults({
    'sensors': []
});


var numeral = require('numeral');

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

function Sensor(id, value, time, host, name) {
  this.id    = id;
  this.name  = name;
  this.value = value;
  this.time  = time;
  this.postprocessor = '';
  this.arg1 = '';
  this.arg2 = '';
  this.arg3 = '';
  this.arg4 = '';
  this.arg5 = '';
  this.output = false;
  this.host = host;
}

var sensors = nconf.get('sensors');
sensors.forEach(function(entry) {
	entry.time = new Date(entry.time);
});

var events = require('events');
var util   = require('util');
 
exports.events = new events.EventEmitter;

var save = _.throttle(function() {
	nconf.set('sensors', sensors);
        nconf.save();
}, 1000);

exports.add = function(id, value, output, host, alias)
{
	if (host == undefined) host = '';
	if (alias == undefined) alias = id;

	var sensor = exports.get(id);
	if (sensor == null)
	{
		sensors.push(new Sensor(id, value, new Date(), host, alias));
                exports.events.emit('newSensor', id, value);
                if (output != undefined)
		{
			sensor = exports.get(id);
			sensor.output = output;
		}
		save();
	}
	else
	{
		var oldvalue = sensor.value;

		if (sensor.postprocessor != "" && typeof sensor.postprocessor != "undefined")
		{
			var pp = getPostProcessor(sensor.postprocessor);
			if (typeof pp != "undefined") value = pp.fnc(value,sensor.arg1,sensor.arg2,sensor.arg3,sensor.arg4,sensor.arg5);
		}

		sensor.value = value;
		sensor.time = new Date();
                if (output != undefined) sensor.output = output;

                exports.events.emit('sensorUpdate', sensor);
                if (value != oldvalue) exports.events.emit('sensorChange', sensor, oldvalue);
	}
}

exports.config = function(id, name, postProcessor, arg1, arg2, arg3, arg4, arg5, output)
{
        var sensor = exports.get(id);
        if (sensor != null)
	{
		sensor.name = name;
		sensor.postprocessor = postProcessor;
		sensor.arg1 = arg1;
                sensor.arg2 = arg2;
                sensor.arg3 = arg3;
                sensor.arg4 = arg4;
                sensor.arg5 = arg5;
	}

	console.log("Saving sensors ...");
	nconf.set('sensors', sensors);
	nconf.save();
}

//Sensor lives, but no data avaliable
exports.ping = function(id)
{
	var sensor = exports.get(id);
	sensor.time = new Date();
	exports.events.emit('sensorUpdate', sensor.value);
}

exports.get = function(id)
{
	return _.find(sensors, function(entry){ return entry.id == id; });
}

exports.list = function(duration, remote)
{
	if (typeof duration == "undefined") duration = 60;
        if (typeof remote == "undefined") remote = false;
	var arr = new Array();
        var n = new Date();

	return sensors.filter(function(entry){
		return ((n.getTime() - entry.time.getTime()) / 1000) <= duration && (remote == true || (remote == false && entry.host == ''));
	});
}

exports.delete = function(id)
{
	var newArray = sensors.slice(0);
	sensors = new Array();

	newArray.forEach(function(entry){
		if (entry.id != id) sensors.push(entry);
	});
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

//setInterval(function(){console.log(sensors);},10000);

