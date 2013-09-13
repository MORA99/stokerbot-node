module.exports.index = function(req, res) {
  res.json(global.sm.list());
}
