import log4js from 'log4js';

const isProdEnv = process.env.NODE_ENV === 'production';

const globalForLogger = global;
const logger = globalForLogger.logger ?? log4js.getLogger();
if (!isProdEnv) globalForLogger.logger = logger;
if (!isProdEnv) logger.level = 'debug';
export default logger;