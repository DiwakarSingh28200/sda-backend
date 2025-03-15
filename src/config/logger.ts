import pino from "pino";
import pretty from "pino-pretty";

const logger = pino(
  pretty({
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss",
    ignore: "pid,hostname",
    singleLine: true, 
  })
);

export default logger;
