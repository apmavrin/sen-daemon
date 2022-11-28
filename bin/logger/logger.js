const fs = require('fs');

function writeLog(inactiveUsers) {
    let logRecord = '';
    for (user of inactiveUsers) {
        logRecord += user.date + ': User: ' + user.email + ' deactivated. \n';
    }
    fs.appendFile('logs/senSync.log', logRecord, function (err) {
        if (err) throw err;
        console.log('Log written!');
      });
}

module.exports = {
    writeLog: writeLog
}
