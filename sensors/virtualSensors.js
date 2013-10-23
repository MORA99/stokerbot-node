var sm = require('../backend/sensorManager.js');

virt = function(sensor) {
        if (sensor.id == "28-000003F96C24")
        {
                sm.add("demo-virt", (sensor.value / 2));
        }

}

sm.events.on("newSensor", virt);
sm.events.on("sensorUpdate", virt);
