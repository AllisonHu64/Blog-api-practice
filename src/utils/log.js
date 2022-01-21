const fs = require('fs');
const path = require('path');

function writeLog(writeStream, log){
    writeStream.write(log + '\n');
}
function createWriteStream(fileName){
    const fullFileName = path.join(__dirname, '../', '../', 'logs/', fileName);
    const writeStream = fs.createWriteStream(fullFileName, {
        flags : 'a'
    });
    return writeStream;
}

// write access log
const accessLogWriteStream = createWriteStream('access.log');
function access(log){
    writeLog(accessLogWriteStream, log);
}

// write error log
const errorLogWriteStream = createWriteStream('error.log');
function error(log){
    writeLog(errorLogWriteStream, log);
}

// write event log
const eventLogWriteStream = createWriteStream('event.log');
function event(log){
    writeLog(eventLogWriteStream, log);
}

module.exports = {
    access,
    error,
    event
}