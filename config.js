const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DB_URI: process.env.DB_URI || 'mongodb://user:pass@host:port/authdb',
    DB_NS:  process.env.DB_NS  || 'dbname',
    DB_COLLECTION: process.env.DB_COLLECTION || 'logs',
    LOG_PATH: process.env.LOG_PATH
}