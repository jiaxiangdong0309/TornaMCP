/**
 * 验证API请求参数
 * @param {string} apiName - API名称
 * @returns {boolean} 是否有效
 */
function validateApiRequest(apiName) {
  // 如果为空字符串，返回true以使用默认值
  if (apiName === "") {
    return true;
  }

  // 检查API名称是否为空
  if (
    apiName === undefined ||
    apiName === null ||
    typeof apiName !== "string"
  ) {
    return false;
  }

  // 检查API名称是否过短，但允许单个字符的关键词
  if (apiName.trim().length < 1) {
    return false;
  }

  return true;
}

/**
 * 验证项目ID参数
 * @param {string} projectId - 项目ID
 * @returns {boolean} 是否有效
 */
function validateProjectId(projectId) {
  if (!projectId) {
    return true; // 项目ID可以为空，使用默认值
  }

  // 检查项目ID格式
  return typeof projectId === "string";
}

module.exports = {
  validateApiRequest,
  validateProjectId,
};
