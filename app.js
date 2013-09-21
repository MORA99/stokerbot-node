var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.PORT || 9999);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes.js');

//Routes
app.get('/', routes.index);
app.get('/sensors', routes.sensors);

app.get('/admin/alarms', routes.alarms);

app.get('/admin/sysinfo', routes.sysinfo);
app.get('/admin/sysinfoajax', routes.sysinfoajax);


//Listen
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




//Socket.io
var io = require("socket.io").listen(server);
io.set('log level', 1);
var ws = require('./websocket.js');

io.sockets.on('connection', function (socket) {
   ws.addListener(socket);
});














//Exports
require('./exports.js');

//Sensor sources
require('./sensors.js');
