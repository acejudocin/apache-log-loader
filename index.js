const config = require('./config');
const fs = require('fs')
const Alpine = require('alpine');
const MongoClient = require("mongodb")
const LogsDAO = require("./src/dao/logsDAO")

const alpine = new Alpine();

MongoClient.connect(
  config.DB_URI,
  {
    poolSize: 10,
    wtimeout: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await LogsDAO.injectDB(client)
  })

setTimeout(() => {
  // Step-1: Copy log from remote server to local.

  // Step-2: Parse log to JSON.
  alpine.parseReadStream(fs.createReadStream(config.LOG_PATH, { encoding: "utf8" }),
    function (log) {
      log.time = new Date(log.time.replace(':', ' '));
      log.status = Number(log.status)
      log.sizeCLF = Number(log.sizeCLF)
      log.reqHeaderReferer = log['RequestHeader Referer']
      delete log['RequestHeader Referer']
      log.reqHeaderUserAgent = log['RequestHeader User-agent']
      delete log['RequestHeader User-agent']
      createDBLogRecord(log);
    })
}, 500);


// Step-3: Store in DB
createDBLogRecord = (log) => {
  try {
    LogsDAO.addLog(log)
  }
  catch(error) {
    console.log(error)
  }
}