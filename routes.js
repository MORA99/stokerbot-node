var sm = require('./backend/sensorManager.js');
var os = require('os');

exports.index = function(req,res){ res.render('index'); }

module.exports.sensors = function(req, res) {
  res.json(sm.list());
};

module.exports.sysinfo = function(req, res) { res.render('admin/sysinfo'); }

module.exports.sysinfoajax = function(req, res) {
  res.json({
   loadavg: os.loadavg(),
   uptime: os.uptime(),
   totalmem: os.totalmem(),
   freemem: os.freemem(),
   hostname: os.hostname(),
   type: os.type(),
   release: os.release(),
   network: os.networkInterfaces()
  });
}
