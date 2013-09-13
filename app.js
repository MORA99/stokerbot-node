var express = require('express');
var app = express();
var routes = require('./routes.js');

app.set('view options', { layout: false });
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/'));


//Routes
app.get('/', routes.index);
app.get("/sensors", routes.sensors);


//Listen
app.listen(9999);
console.log('Listening on port 9999');



//Exports
require('./exports.js');

//Sensor sources
require('./sensors.js');
