Userscripts
===

All .js files in here will be included in the app.

By listening to events, you can add new behaviors to the bot.

Simple virtual sensor
---
    var sm = require('../backend/sensorManager.js');
    sm.events.on("sensorUpdate", function(id, val) { if (id == "28-000003F96C24") { sm.add("demo-virt", (val / 2)); } });


