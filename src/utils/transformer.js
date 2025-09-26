/**
 * 将Torna API文档转换为MCP友好格式
 * @param {Array|Object} apiData - Torna API文档数据
 * @returns {Object} MCP格式的API文档
 */
function transformApiDocToMCP(apiData) {
  // 处理空数据
  if (!apiData) {
    return {
      message: "没有找到匹配的API文档",
      apis: [],
    };
  }

  // 处理数组情况
  if (Array.isArray(apiData)) {
    if (apiData.length === 0) {
      return {
        message: "没有找到匹配的API文档",
        apis: [],
      };
    }

    // 如果有多个结果，返回简化列表
    if (apiData.length > 1) {
      return {
        message: `找到${apiData.length}个匹配的API`,
        apis: apiData.map((api) => transformSingleApiToMCP(api)),
      };
    }

    // 如果只有一个结果，直接返回详细信息
    return transformSingleApiToMCP(apiData[0]);
  }

  // 处理单个API对象
  return transformSingleApiToMCP(apiData);
}

/**
 * 转换单个API为MCP格式
 * @param {Object} api - 单个API信息
 * @returns {Object} MCP格式的API信息
 */
function transformSingleApiToMCP(api) {
  if (!api) {
    return {
      message: "API数据为空",
      name: "",
      method: "GET",
      url: "",
      description: "",
      contentType: "application/json",
      request: {
        headers: [],
        params: [],
      },
      response: {
        params: [],
      },
    };
  }

  // 基本信息
  const result = {
    name: api.name || "",
    method: api.httpMethod || "GET",
    url: api.url || "",
    description: api.description || "",
    contentType: api.contentType || "application/json",
    request: {
      headers: [],
      params: [],
    },
    response: {
      params: [],
    },
  };

  // 处理请求头参数
  if (api.headerParams && Array.isArray(api.headerParams)) {
    result.request.headers = api.headerParams
      .filter((param) => param && param.name) // 过滤掉无效的参数
      .map((param) => ({
        name: param.name || "",
        type: param.type || "string",
        required: param.required === 1,
        description: param.description || "",
        example: param.example || "",
      }));
  }

  // 处理请求参数（包括query参数和body参数）
  if (api.requestParams && Array.isArray(api.requestParams)) {
    result.request.params = api.requestParams
      .filter((param) => param && param.name) // 过滤掉无效的参数
      .map((param) => ({
        name: param.name || "",
        type: param.type || "string",
        required: param.required === 1,
        description: param.description || "",
        example: param.example || "",
      }));
  }

  // 处理响应参数
  if (api.responseParams && Array.isArray(api.responseParams)) {
    result.response.params = transformResponseParams(api.responseParams);
  }

  return result;
}

/**
 * 转换响应参数，保持参数层级关系
 * @param {Array} params - 响应参数列表
 * @param {string} parentId - 父参数ID
 * @returns {Array} 转换后的参数列表
 */
function transformResponseParams(params, parentId = "") {
  if (!params || !Array.isArray(params)) return [];

  return params
    .filter((param) => param && param.name && param.parentId === parentId) // 过滤掉无效的参数
    .map((param) => {
      const transformedParam = {
        name: param.name || "",
        type: param.type || "string",
        description: param.description || "",
        example: param.example || "",
      };

      // 递归处理子参数
      const children = transformResponseParams(params, param.id);
      if (children.length > 0) {
        transformedParam.children = children;
      }

      return transformedParam;
    });
}

module.exports = {
  transformApiDocToMCP,
  transformSingleApiToMCP,
  transformResponseParams,
};
