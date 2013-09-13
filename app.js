var express = require('express');
var app = express();
var routes = require('./routes.js');

var sm = require('./backend/sensorManager.js');
var ow = require('./backend/ow.js');
global.sm = sm;

app.set('view options', { layout: false });
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/'));



//Routes
app.get('/', function(req,res){ res.render('index'); });

var sensors = require('./sensors.js');
app.get("/sensors", sensors.index);


//Listen
app.listen(9999);
console.log('Listening on port 9999');

//Onewire
ow.start(sm);

//Exports
var sb = require('./exports/stokerbot.js');

