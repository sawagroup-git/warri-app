import winston from 'winston';
import path from 'path';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...rest }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(rest).length ? JSON.stringify(rest, null, 2) : ''
    }`;
  })
);

class LoggingService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      defaultMeta: { service: 'wari-backend' },
      transports: [
        new winston.transports.File({
          filename: path.join(__dirname, '../logs/error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(__dirname, '../logs/combined.log'),
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: consoleFormat,
        })
      );
    }
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string, error?: any, meta?: any): void {
    this.logger.error(message, { error, ...meta });
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}

export const logger = new LoggingService();
export default logger;
