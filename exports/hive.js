var sm = require('../backend/sensorManager.js');
var constants = require('../constants.js');

var clientid = constants.clientid;
var connected = false;

var io = require('socket.io-client'),

/*
First reconnect attempt after 100ms, then it doubles for each attempt up to a max of 60000ms
We never stop retrying to connect, and we reconnect everytime we get disconnected
*/

socket = io.connect('web.xen1.dk', {
    port: 3000,
    reconnect: true,
    'reconnection delay': 100,
    'reconnection limit': 10000,
    'max reconnection attempts': Infinity
});

socket.on('disconnect', function(){
console.log("Hive connection lost");
connected = false;
});

socket.on('connect', function () {
console.log("Hive connected");
socket.emit('register', clientid);
connected = true;
});

socket.on('sensor', function (host, data) {
  var id = host+'_'+data.name;
  sm.add(id,data.value,0,host,data.name);
});

function sendSensor(id, value)
{
	var sensor = sm.get(id);
	if (connected && sensor.host == '')
		socket.emit('sensor', [{'name':id, 'value':value}]);
}

function sendSensors()
{
        sm.list().forEach(function(entry) {
		sendSensor(entry.id,entry.value);
        });
}

setInterval(sendSensors, 120000);//Send sensors every 30secs even if not changed
//setInterval(connect, 60000);//Retry connection to stokerlog.dk every minute if its failed
//connect();//Initial connect attempt

sm.events.on("newSensor", function(id, value) { sendSensor(id, value); });
sm.events.on("sensorChange", function(id, oldvalue, newvalue) { sendSensor(id, newvalue); });

