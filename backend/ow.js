var sense = require('ds18b20');
var async = require('async');
var sm = require('../backend/sensorManager.js');

	setInterval(function() {
		sense.sensors(function(err, ids) {
                   async.each(ids, function(id, cb) {
                      sense.temperature(id, function(err, temp) {
                          sm.add(id.toUpperCase(), temp);
			  cb(null);
                      });
		   });
		});
	}, 10000);
