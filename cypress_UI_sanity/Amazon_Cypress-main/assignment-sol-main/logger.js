const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const fs = require("fs");

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: "test" }), timestamp(), myFormat),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: "logs/info.log" }),
    new transports.Console({ level: "error" }),
  ],
});
// fs.unlinkSync("logs/info.log");
logger.info(`log has started`);

module.exports = logger;
