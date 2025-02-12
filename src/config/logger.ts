import { createLogger, transports } from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

const loggingWinston = new LoggingWinston();

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console(),
    loggingWinston
  ]
});

export { logger };