type LogLevel = 'INFO' | 'WARN' | 'ERROR';

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  metadata?: Record<string, any>;
}

class ObservabilityLogger {
  private static formatLog(level: LogLevel, message: string, metadata?: Record<string, any>): LogPayload {
    return {
      message,
      level,
      timestamp: new Date().toISOString(),
      metadata,
    };
  }

  static info(message: string, metadata?: Record<string, any>) {
    const payload = this.formatLog('INFO', message, metadata);
    console.log(JSON.stringify(payload));
  }

  static warn(message: string, metadata?: Record<string, any>) {
    const payload = this.formatLog('WARN', message, metadata);
    console.warn(JSON.stringify(payload));
  }

  static error(message: string, error?: Error, metadata?: Record<string, any>) {
    const payload = this.formatLog('ERROR', message, {
      ...metadata,
      errorMessage: error?.message,
      errorStack: error?.stack,
    });
    console.error(JSON.stringify(payload));
  }
}

export default ObservabilityLogger;
export { ObservabilityLogger };
