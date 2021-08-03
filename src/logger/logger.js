const winston = require('winston')
const logFileName = process.env.LOG_FILE_NAME
const logDirPath = process.env.LOG_DIR_PATH
module.exports = winston.createLogger({
    level: 'info',
    dirname: logDirPath,
    filename: `${logFileName}-%DATE%.log`,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logs.log'})
    ]
});