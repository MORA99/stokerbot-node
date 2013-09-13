var sense = require('ds18b20'),
    async = require('async');

exports.start = function(sm) {
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
}
