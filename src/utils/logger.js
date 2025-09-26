/**
 * 日志工具
 */

// 日志级别
const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

// 当前日志级别
const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL || LOG_LEVELS.INFO;

/**
 * 格式化日期时间
 * @returns {string} 格式化的日期时间
 */
function getFormattedDateTime() {
  const now = new Date();
  return now.toISOString();
}

/**
 * 检查是否应该记录指定级别的日志
 * @param {string} level - 日志级别
 * @returns {boolean} 是否应该记录
 */
function shouldLog(level) {
  const levels = Object.values(LOG_LEVELS);
  const currentIndex = levels.indexOf(CURRENT_LOG_LEVEL);
  const targetIndex = levels.indexOf(level);

  return targetIndex <= currentIndex;
}

/**
 * 记录错误日志
 * @param {string} message - 日志消息
 * @param {Error|Object} [error] - 错误对象
 */
function logError(message, error) {
  if (!shouldLog(LOG_LEVELS.ERROR)) return;

  const timestamp = getFormattedDateTime();
  console.error(`[${timestamp}] [ERROR] ${message}`);

  if (error) {
    if (error instanceof Error) {
      console.error(`${error.message}\n${error.stack}`);
    } else {
      console.error(JSON.stringify(error, null, 2));
    }
  }
}

/**
 * 记录警告日志
 * @param {string} message - 日志消息
 */
function logWarn(message) {
  if (!shouldLog(LOG_LEVELS.WARN)) return;

  const timestamp = getFormattedDateTime();
  console.warn(`[${timestamp}] [WARN] ${message}`);
}

/**
 * 记录信息日志
 * @param {string} message - 日志消息
 */
function logInfo(message) {
  if (!shouldLog(LOG_LEVELS.INFO)) return;

  const timestamp = getFormattedDateTime();
  console.info(`[${timestamp}] [INFO] ${message}`);
}

/**
 * 记录调试日志
 * @param {string} message - 日志消息
 * @param {Object} [data] - 调试数据
 */
function logDebug(message, data) {
  if (!shouldLog(LOG_LEVELS.DEBUG)) return;

  const timestamp = getFormattedDateTime();
  console.debug(`[${timestamp}] [DEBUG] ${message}`);

  if (data) {
    console.debug(JSON.stringify(data, null, 2));
  }
}

module.exports = {
  logError,
  logWarn,
  logInfo,
  logDebug,
  LOG_LEVELS,
};
