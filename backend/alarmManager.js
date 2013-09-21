/*
sm.events.on("newSensor", function(id, value) { console.log("New sensor: "+id); });
sm.events.on("sensorUpdate", function(id, value) { console.log("Sensor update: "+id+" ("+value+")"); });
sm.events.on("sensorChange", function(id, oldvalue, newvalue) { console.log("Sensor change: "+id+" ("+oldvalue+" => "+newvalue+")"); });
*/


function Alarm(id, source, cmp, val, cmptarget, target, targetval, targetreverse, active) {
  this.id     = id;
  this.source = source;
  this.cmp    = cmp;
  this.val    = val;
  this.cmptarget = cmptarget;
  this.target=target;
  this.targetreverse = targetreverse;
  this.active = active;
}

var alarms = new Array();
var events = require('events');
var util   = require('util');
 
exports.events = new events.EventEmitter;

exports.add = function(id, source, cmp, val, cmptarget, target, targetval, targetreverse, active)
{
	var alarm = exports.get(id);
	if (alarm == null)
	{
		alarms.push(new Alarm(id, source, cmp, val));
//                exports.events.emit('newSensor', id, value);
	}
	else
	{
		alarm.source = source;
		alarm.cmp = cmp;
		alarm.val = val;
		alarm.cmptarget = cmptarget;
		alarm.target=target;
		alarm.targetreverse = targetreverse;
		alarm.active = active;		

//                exports.events.emit('sensorUpdate', id, value);
	}
}

exports.get = function(id)
{
	var res = null;
	alarms.forEach(function(entry) {
		if (entry.id == id)
			res=entry;
	});
	return res;
}

exports.list = function()
{
	return alarms;
}

exports.add("freezer", "28-000003F951F3", "<", "18", "D0", 1, 1, true);
exports.add("cooker", "28-000003F96C24", ">", "22", "D1", 1, 1, true);
