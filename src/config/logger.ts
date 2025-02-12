import { format, createLogger, transports } from "winston";
const { combine, timestamp, json, errors } = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new transports.Console()
  ]
});

export { logger };