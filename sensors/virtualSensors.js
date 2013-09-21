var sm = require('../backend/sensorManager.js');

virt = function(id, val) {
        if (id == "28-000003F96C24")
        {
                sm.add("demo-virt", (val / 2));
        }

}

sm.events.on("newSensor", virt);
sm.events.on("sensorUpdate", virt);
