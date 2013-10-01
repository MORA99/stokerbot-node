var sm = require('./backend/sensorManager.js');
var am = require('./backend/alarmManager.js');

var os = require('os');

exports.index = function(req,res) {
	res.render('index', {
		sensors: sm.list()
	}); 
}

module.exports.sensors = function(req, res) {
  res.json(sm.list());
};

module.exports.alarms = function(req,res) {
	res.render('admin/alarms', {
		sensors: sm.list(),
		alarms: am.list()
	});
}

module.exports.alarmssave = function(req,res) {
id = 0;
while (typeof req.body['id'+id] != "undefined")
{
	var 	idd = req.body['id'+id],
		name = req.body['name'+id],
		source = req.body['source'+id],
		cmp = req.body['cmp'+id],
		cmptarget = req.body['cmptarget'+id],
		target = req.body['target'+id],
		targetstate = req.body['targetstate'+id],
		targetreverse = req.body['targetreverse'+id],
		active = req.body['active'+id],
		del = req.body['delete'+id];

	if (typeof active == "undefined") active = 0;
        if (typeof targetreverse == "undefined") targetreverse = 0;

	if (typeof del != "undefined")
		am.delete(idd);
	else
		am.add(idd,name,source,cmp,cmptarget,target,targetstate,targetreverse,active);

	id++;
}
	res.redirect('/admin/alarms');
}

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
