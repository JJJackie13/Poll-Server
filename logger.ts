import winston, { format } from "winston";
import { format as dateFormat } from "fecha";

const { printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    let date = dateFormat(new Date(), "YYYY-MM-DD hh:mm:ss");
    return `${date} [${level}] : ${message}`;
});

export const logger = winston.createLogger({
    level: process.env.LOGGER_LEVEL || "silly",
    format: winston.format.combine(winston.format.colorize(), myFormat),
    transports: [new winston.transports.Console()],
});
