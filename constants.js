var fs = require('fs');
exports.clientid = fs.readFileSync('/sys/class/net/eth0/address', 'utf8').replace(/\s/g, "");
