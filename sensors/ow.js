var sense = require('ds18b20');
var async = require('async');
var sm = require('../backend/sensorManager.js');

	setInterval(function() {
		sense.sensors(function(err, ids) {
		   if (typeof ids !== "undefined")
		   {
                   async.each(ids, function(id, cb) {
                      sense.temperature(id, function(err, temp) {
			  if (typeof temp !== "undefined") sm.add(id.toUpperCase(), temp);
			  cb(null);
                      });
		   });
		   }
		});
	}, 2000);
