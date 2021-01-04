import { createLogger, format, transports } from 'winston';
import type { Logger as Winston } from 'winston';
import type { Logger } from '../lib/logger';

export class WinstonLogger implements Logger {
  private winston: Winston;

  constructor() {
    this.winston = createLogger({
      format: format.combine(format.splat(), format.cli()),
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      transports: [new transports.Console()],
    });
  }

  public debug(message: string, ...meta: any[]) {
    this.winston.debug(message, ...meta);
  }

  public error(message: string, ...meta: any[]) {
    this.winston.error(message, ...meta);
  }

  public info(message: string, ...meta: any[]) {
    this.winston.info(message, ...meta);
  }

  public warn(message: string, ...meta: any[]) {
    this.winston.warn(message, ...meta);
  }
}
