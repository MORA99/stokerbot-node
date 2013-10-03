var nconf = require('nconf');
nconf.file('configuration.json');

nconf.defaults({
    'alarms': []
});

function Alarm(id, name, source, cmp, val, target, targetval, targetreverse, active) {
  this.id     = id;
  this.name   = name;
  this.source = source;
  this.cmp    = cmp;
  this.val    = val;
  this.target=target;
  this.targetval = targetval;
  this.targetreverse = targetreverse;
  this.active = active;
  this.triggered = false;
}

var alarms = nconf.get('alarms')
alarms.forEach(function(entry) {
	entry.triggered = false;
});


var events = require('events');
var util   = require('util');
 
exports.events = new events.EventEmitter;

exports.add = function(id, name, source, cmp, val, target, targetval, targetreverse, active)
{
	console.log("add(%s, %s, %s, %s, %s, %s, %s, %s, %s)", id, name, source, cmp, val, target, targetval, targetreverse, active);
	var alarm = exports.get(id);
	if (alarm == null)
	{
		var id = 0;
		alarms.forEach(function(entry) { if (entry.id > id) id = entry.id;});
		id++;
		alarms.push(new Alarm(id, name, source, cmp, val, target, targetval, targetreverse, active));
                exports.events.emit('newAlarm', id);
	}
	else
	{
		alarm.name = name;
		alarm.source = source;
		alarm.cmp = cmp;
		alarm.val = val;
		alarm.target=target;
		alarm.targetval = targetval;
		alarm.targetreverse = targetreverse;
		alarm.active = active;		

                exports.events.emit('alarmUpdate', id);
	}
	nconf.set('alarms', alarms);
	nconf.save();
	handleAlarm(id);
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

exports.delete = function(id)
{
	var newArray = alarms.slice(0);
	alarms = new Array();

	newArray.forEach(function(entry){
		if (entry.id != id) alarms.push(entry);
	});
}


var sm = require('./sensorManager.js');

//Check alarms 10 seconds after startup
setTimeout(function(){

	checkAlarms();
	sm.events.on("sensorChange", function(id, oldvalue, newvalue) {

        	alarms.forEach(function(entry) {
                	if (entry.source == id)
			{
				handleAlarm(entry.id);
			}
        	});

	});

}, 10000);

checkAlarms = function()
{
                alarms.forEach(function(entry) {
	                handleAlarm(entry.id);
                });
}

handleAlarm = function(id)
{
	var alarm = exports.get(id);
	var sensor = sm.get(alarm.source);

        console.log("Handle alarm %s (%s %s %s)",id,sensor.value,alarm.cmp,alarm.val);

	var triggered = false;
	if (alarm.cmp == '<' && sensor.value < alarm.val   ) triggered = true;
	if (alarm.cmp == '=' && sensor.value == alarm.val  ) triggered = true;
	if (alarm.cmp == '!=' && sensor.value != alarm.val ) triggered = true;
	if (alarm.cmp == '>' && sensor.value > alarm.val   ) triggered = true;

	if (triggered)
	{
		console.log("Trig");

                if (alarm.target != "")
                {
	                var st = sm.get(alarm.target);
                        if (st != null) sm.add(alarm.target, 1);
        	}

		if (alarm.triggered == false)
		{
			console.log("Alarm triggered");

			exports.events.emit('alarmTriggered', id);
			alarm.triggered = true;
		} else{
			console.log("Alarm was already triggered");
		}
	} else {
                        if (alarm.target != "" && alarm.targetreverse)
                        {
                                var st = sm.get(alarm.target);
                                if (st != null) sm.add(alarm.target, 0);
                        }


		if (alarm.triggered == true)
		{
			console.log("Alarm stopped");
			exports.events.emit('alarmStopped', id);
			alarm.triggered = false;
		}
	}
}

//function(id, name, source, cmp, val, target, targetval, targetreverse, active)
//exports.add("", "freezer", "28-000003F951F3", "<", "22", "DO1", 1, 1, true);
//exports.add("", "cooker", "28-000003F96C24", ">", "22", "DO2", 1, 1, true);
