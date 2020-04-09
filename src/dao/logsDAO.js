const config = require('../../config')

let logs

module.exports = class LogsDAO {
  static async injectDB(conn) {
    if (logs) {
      return
    }
    try {
      logs = await conn.db(config.DB_NS).collection(config.DB_COLLECTION)
    } catch (e) {
      console.error(`Unable to establish collection handler in LogsDAO: ${e}`)
    }
  }

  /**
   * Adds a log to the `config.DB_COLLECTION` collection
   * @param {log} log - The information of the log to add
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addLog(log) {

    try {
      await logs.insertOne(log)
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while adding new log, ${e}.`)
      return { error: e }
    }
  }

}
