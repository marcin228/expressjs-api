"use strict";
const winston = require("winston");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({
            filename: process.env.LOG_FILE || "logs.log",
        }),
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});
module.exports = logger;
