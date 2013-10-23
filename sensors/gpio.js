var sm = require('../backend/sensorManager.js');
var b = require('bonescript');

var outputs = new Array();
outputs.push({"id":"DO1", "sensor":undefined, "gpio":"P8_41"});
outputs.push({"id":"DO2", "sensor":undefined, "gpio":"P8_42"});
outputs.push({"id":"DO3", "sensor":undefined, "gpio":"P8_43"});
outputs.push({"id":"DO4", "sensor":undefined, "gpio":"P8_44"});

var inputs = new Array();
inputs.push({"id":"DI1", "sensor":undefined, "gpio":"P8_14"});
inputs.push({"id":"DI2", "sensor":undefined, "gpio":"P8_15"});
inputs.push({"id":"DI3", "sensor":undefined, "gpio":"P8_16"});
inputs.push({"id":"DI4", "sensor":undefined, "gpio":"P8_17"});

//Init sensors
outputs.forEach(function(entry){
	b.pinMode(entry.gpio, b.OUTPUT);
	sm.add(entry.id, 0, true);
	entry.sensor = sm.get(entry.id);
});

inputs.forEach(function(entry){
        b.pinMode(entry.gpio, b.INPUT);
        sm.add(entry.id, 0);
        entry.sensor = sm.get(entry.id);
});

//b.digitalWrite('P8_44', b.HIGH);
//b.digitalWrite('P8_44', b.LOW);

//Read inputs

setInterval(function() {
	inputs.forEach(function(entry) {
		b.digitalRead(entry.gpio, function (x) {
			sm.add(entry.id, x.value);
		});
	});
}, 1000);


setInterval(function() {
        outputs.forEach(function(entry) {
		sm.ping(entry.id);
        });
}, 30000);

sensorChange = function(name, value) {
        outputs.forEach(function(entry) {
                if (entry.id == name)
		{
			if (value == 1)
	                        b.digitalWrite(entry.gpio, b.HIGH);
	                else
	                        b.digitalWrite(entry.gpio, b.LOW);
		}
        });
}

sm.events.on("sensorChange", function(sensor, oldValue) { sensorChange(sensor, sensor.value); });
/*
setInterval(function(){
setTimeout(function(){sm.add("DO1", 1);},1000);
setTimeout(function(){sm.add("DO2", 1);},2000);
setTimeout(function(){sm.add("DO3", 1);},3000);
setTimeout(function(){sm.add("DO4", 1);},4000);

setTimeout(function(){sm.add("DO1", 0);},3000);
setTimeout(function(){sm.add("DO2", 0);},4000);
setTimeout(function(){sm.add("DO3", 0);},5000);
setTimeout(function(){sm.add("DO4", 0);},6000);
}, 10000);
*/
