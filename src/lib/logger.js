class Logger {
    constructor(level) {
        this.level = level;
    }
    log(message, level) {
        if (level === 'debug' && this.level !== 'debug') return;

        const timestamp = new Date().toLocaleString();
        const logMessage = `KForum - ${timestamp} [${level.toUpperCase()}] - ${message}`;
        if (level === 'error') {
            console.error(logMessage);
        } else {
            console.log(logMessage);
        }
    }
    info(message) {
        this.log(message, 'info');
    }
    debug(message) {
        this.log(message, 'debug');
    }
    warn(message) {
        this.log(message, 'warn');
    }
    error(message) {
        this.log(message, 'error');
    }
}

const isProdEnv = process.env.NODE_ENV === 'production';

const globalForLogger = global;
const logger = globalForLogger.logger ?? new Logger(!isProdEnv ? 'debug' : 'warn');
if (!isProdEnv) globalForLogger.logger = logger;
export default logger;