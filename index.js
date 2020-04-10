const config = require('./config');
const fs = require('fs');
const Alpine = require('alpine');
const fetch = require("isomorphic-fetch")

const alpine = new Alpine();

const parameters = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'no-cors',
  body: new Object()
}

setTimeout( async () => {
  // Step-1: Copy log from remote server to local.

  // Step-2: Parse log to JSON.
  alpine.parseReadStream(fs.createReadStream(config.LOG_PATH, { encoding: "utf8" }),
    async function (log) {
      delete log.originalLine
      log.time = new Date(log.time.replace(':', ' '))
      log.status = Number(log.status)
      log.sizeCLF = Number(log.sizeCLF)
      log.reqHeaderReferer = log['RequestHeader Referer']
      delete log['RequestHeader Referer']
      log.reqHeaderUserAgent = log['RequestHeader User-agent']
      delete log['RequestHeader User-agent']
      await postLog(log)
    })
}, 500);

// Step-3:
/** Api POST call to store log in DB */
async function postLog (log) {

  try {
    parameters.body = JSON.stringify(log)
    // await response of fetch call
    let response = await fetch(config.API_URL, parameters)
    // only proceed once promise is resolved
    let data = await response.json()
    // only proceed once second promise is resolved
    return data
  } catch (error) {console.log(error)}
}
