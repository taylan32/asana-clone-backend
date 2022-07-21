const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "project-service" },
  transports: [
    new winston.transports.File({
      filename: "v1/src/logs/project/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "v1/src/logs/project/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "v1/src/logs/project/combined.log",
    }),
    // new winston.transports.Console()
  ],
});


module.exports = logger