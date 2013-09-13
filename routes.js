exports.index = function(req,res){ res.render('index'); }

module.exports.sensors = function(req, res) {
  res.json(global.sm.list());
};
