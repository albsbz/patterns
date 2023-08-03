import { promises as fs } from 'fs';
import { join } from 'path';

// PATTERN: Observer
export enum Level {
  info = 'info',
  warning = 'warning',
  error = 'error',
}

interface ILoggerPayload {
  message: string;
  payload?: any;
}

interface ISubscriberPayload {
  message: string;
  payload?: any;
  logLevel?: Level;
}

interface ILogger {
  info?: Function;
  warning?: Function;
  error?: Function;
}

class Logger {
  subscribers: ILogger[];
  constructor() {
    this.subscribers = [];
  }
  log(subscriberPayload: ISubscriberPayload) {
    const { message, payload, logLevel = Level.info } = subscriberPayload;
    this.subscribers.forEach((subscriber) => {
      if (subscriber[logLevel]) {
        subscriber[logLevel]({ message, payload });
      }
    });
  }

  subscribe(subscriber: ILogger) {
    this.subscribers.push(subscriber);
    return this;
  }
}

class FileLogger implements ILogger {
  createMessage(payload, level) {
    return `${new Date().toISOString()} - [${level}]: ${payload.message} - ${
      payload.payload ? JSON.stringify(payload.payload, null, 4) : ''
    }\n\n`;
  }
  writeToFile(message) {
    fs.writeFile(join(process.cwd(), 'logs', 'logs.txt'), message, {
      flag: 'a+',
    });
  }
  info(payload: ILoggerPayload) {
    this.writeToFile(this.createMessage(payload, Level.info));
  }
  warning(payload: ILoggerPayload) {
    this.writeToFile(this.createMessage(payload, Level.warning));
  }
}

class ConsoleLogger implements ILogger {
  error(payload: ILoggerPayload): void {
    // eslint-disable-next-line no-console
    console.log(payload);
  }
}

const logger = new Logger();

logger.subscribe(new ConsoleLogger()).subscribe(new FileLogger());

export default logger;
