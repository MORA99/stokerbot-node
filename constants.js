require('fs');

exports.clientid = '';

fs.readFile('/sys/class/net/eth0/address', 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    exports.clientid = data.replace(/\s/g, "");
});

