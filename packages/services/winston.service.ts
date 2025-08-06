import { createLogger, format, transports } from 'winston';
import path from 'path';

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
    new transports.Console(),
  ],
});

export const errorLogger = (error: unknown) => {
  if (error instanceof Error) {
    logger.error({
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  } else {
    logger.error({
      message: 'Unknown error',
      details: error,
    });
  }
};
