var net = require('net');
var sm = require('../backend/sensorManager.js');
var constants = require('../constants.js');

var HOST = 'web.xen1.dk';
var PORT = 8888;

var client = new net.Socket();
var connected = false;
var clientid = constants.clientid;

function connect()
{
	if (!connected && clientid != '')
	{
		client.connect(PORT, HOST, function() {
		    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
		    client.write('{"command":"register","value":"'+clientid+'"}\r\n');
		    connected = true;
		});
	}
}

client.on('data', function(data) {   
    console.log('DATA: ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
    connected = false;
});

function sendSensor(sensor)
{
	if (connected && clientid != '')
		client.write('{"command":"sensor","value":[{"name":"'+sensor.id+'","value":"'+sensor.value+'"}]}\r\n');
}


function sendSensors()
{
	sm.list().forEach(function(entry) {
		console.log(entry);
		if (entry.host == '') sendSensor(entry.id, entry.value);
	});
}

setInterval(sendSensors, 30000);//Send sensors every 30secs even if not changed
setInterval(connect, 60000);//Retry connection to stokerlog.dk every minute if its failed
connect();//Initial connect attempt

sm.events.on("newSensor", function(sensor) { sendSensor(sensor); });
sm.events.on("sensorChange", function(sensor, oldvalue) { sendSensor(sensor); });


