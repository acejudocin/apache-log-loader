const config = require('./config');
var fs = require('fs')
var Alpine = require('alpine');
var alpine = new Alpine();

setTimeout( () => {
    // Step-1: Copy log from remote server to local.

    // Step-2: Parse log to JSON.
    alpine.parseReadStream(fs.createReadStream(config.LOG_PATH, {encoding: "utf8"}),
      function(data) {
        data.time = new Date(data.time.replace(':',' '));
        createDBRecord(data);
      })
  }
, 500);

// Step-3: Store in DB
createDBRecord = (record) => {
  console.log(record)
}