const axios = require("axios");
const { logError, logInfo } = require("../utils/logger");
const {
  transformApiDocToMCP,
  transformSingleApiToMCP,
} = require("../utils/transformer");

// 从环境变量获取Torna配置
const TORNA_API_URL = process.env.TORNA_API_URL ;
const TORNA_API_TOKEN =
  process.env.TORNA_API_TOKEN ;
const DEFAULT_PROJECT_ID = process.env.TORNA_PROJECT_ID ;

/**
 * 创建Torna API客户端
 * @returns {Object} Axios实例
 */
function createTornaClient() {
  // 检查配置
  if (!TORNA_API_URL) {
    throw new Error("未配置Torna API URL");
  }

  if (!TORNA_API_TOKEN) {
    throw new Error("未配置Torna API Token");
  }

  // 确保API URL是有效的URL格式
  let baseURL = TORNA_API_URL;

  // 如果URL不是以http或https开头，则添加https://
  if (!/^https?:\/\//i.test(baseURL)) {
    baseURL = `https://${baseURL}`;
  }

  // 确保URL正确格式化
  try {
    // 测试URL是否有效
    new URL(baseURL);

    // 规范化baseURL确保以/结尾
    if (!baseURL.endsWith("/")) {
      baseURL = `${baseURL}/`;
    }

    logInfo(`正在创建Torna客户端，BaseURL: ${baseURL}`);
  } catch (error) {
    logError(`无效的Torna API URL: ${baseURL}`, error);
    throw new Error(`无效的Torna API URL: ${baseURL}`);
  }

  const client = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TORNA_API_TOKEN}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Origin: "https://torna.hewa.cn",
      Referer: "https://torna.hewa.cn/",
    },
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      // 确保URL路径格式正确
      if (config.url && config.url.startsWith("/")) {
        config.url = config.url.substring(1);
      }

      logInfo(`发送请求到Torna: ${config.url}`);
      return config;
    },
    (error) => {
      logError("Torna请求错误", error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.code === "ERR_INVALID_URL") {
        logError(`无效的URL: ${error.config?.url || "未知URL"}`, error);
      } else {
        logError("Torna响应错误", error);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * 获取项目信息
 * @param {string} projectId - 项目ID
 * @returns {Promise<Object>} 项目信息
 */
async function getProjectInfo(projectId = DEFAULT_PROJECT_ID) {
  try {
    if (!projectId) {
      projectId = DEFAULT_PROJECT_ID;
    }

    const client = createTornaClient();

    // 调用Torna获取项目信息 - 由于/project/info不可用，尝试使用/doc/view
    const response = await client.get("doc/view", {
      params: {
        id: projectId,
      },
    });

    // 检查响应
    if (response.data && response.data.code === "0") {
      return response.data.data;
    } else {
      throw new Error(
        `Torna API错误: ${
          response.data?.message || response.data?.msg || "未知错误"
        }`
      );
    }
  } catch (error) {
    logError(`获取项目信息失败: ${projectId}`, error);
    throw error;
  }
}

/**
 * 通过名称获取API文档
 * @param {string} apiName - API名称或关键词
 * @param {string} projectId - 可选，项目ID
 * @returns {Promise<Object>} 处理后的API文档
 */
async function getApiDocsByName(apiName, projectId = DEFAULT_PROJECT_ID) {
  try {
    // 确保有有效参数
    if (!apiName || apiName.trim() === "") {
      apiName = ""; // 使用空字符串来获取所有API
    }

    if (!projectId) {
      projectId = DEFAULT_PROJECT_ID;
    }

    const client = createTornaClient();

    try {
      // 获取项目的模块列表
      const modules = await getProjectModules(projectId);

      if (!modules || modules.length === 0) {
        logInfo(`未找到模块，项目ID: ${projectId}`);
        return { message: "未找到模块", apis: [] };
      }

      let allApis = [];

      // 遍历每个模块获取API
      for (const module of modules) {
        try {
          if (!module || !module.id) {
            logInfo(`模块信息不完整，跳过`);
            continue;
          }

          logInfo(`获取模块API: ${module.name || module.id}`);

          // 使用正确的端点获取模块下的API列表
          const response = await client.get("doc/list", {
            params: {
              moduleId: module.id,
            },
          });

          if (
            response.data &&
            response.data.code === "0" &&
            Array.isArray(response.data.data)
          ) {
            // 收集所有API
            const apis = response.data.data;
            logInfo(
              `已获取${apis.length}个API从模块: ${module.name || module.id}`
            );

            // 处理文件夹结构，提取所有API (非文件夹)
            const allModuleApis = extractApisFromTree(apis);
            logInfo(`处理后API数量: ${allModuleApis.length}`);

            // 过滤匹配apiName的API
            const matchedApis = apiName
              ? allModuleApis.filter(
                  (api) =>
                    api.name &&
                    api.name.toLowerCase().includes(apiName.toLowerCase())
                )
              : allModuleApis;

            if (apiName) {
              logInfo(
                `匹配关键词"${apiName}"的API数量: ${matchedApis.length}/${allModuleApis.length}`
              );
            }

            allApis = [...allApis, ...matchedApis];
          }
        } catch (moduleError) {
          logError(`获取模块API失败: ${module.id}`, moduleError);
          // 继续处理其他模块
        }
      }

      // 转换为MCP格式
      logInfo(`总计获取到${allApis.length}个匹配的API`);
      return transformApiDocToMCP(allApis);
    } catch (innerError) {
      logError(`处理API数据失败`, innerError);
      throw new Error(`处理API数据失败: ${innerError.message}`);
    }
  } catch (error) {
    logError(`获取API文档失败: ${apiName}`, error);
    throw new Error(`获取API文档失败: ${error.message}`);
  }
}

/**
 * 从API树结构中提取所有API (非文件夹项)
 * @param {Array} apiTree - API树结构
 * @returns {Array} 扁平化的API列表
 */
function extractApisFromTree(apiTree) {
  if (!apiTree || !Array.isArray(apiTree)) {
    return [];
  }

  let result = [];

  for (const item of apiTree) {
    if (!item) continue;

    // 如果是文件夹，跳过但处理其子项
    if (item.isFolder) {
      // 查找该文件夹的所有子项
      const children = apiTree.filter((api) => api && api.parentId === item.id);
      if (children.length > 0) {
        result = [...result, ...extractApisFromTree(children)];
      }
    } else {
      // 如果是API，直接添加
      result.push(item);
    }
  }

  return result;
}

/**
 * 获取API文档详情
 * @param {string} apiId - API的ID
 * @returns {Promise<Object>} API详情
 */
async function getApiDocDetail(apiId) {
  try {
    if (!apiId) {
      throw new Error("API ID是必须的");
    }

    const client = createTornaClient();

    logInfo(`获取API详情，ID: ${apiId}`);

    // 使用完整URL路径，避免URL构建问题
    const response = await client.get(`doc/view/detail`, {
      params: {
        id: apiId,
      },
    });

    // 检查响应
    if (response.data && response.data.code === "0") {
      logInfo(`成功获取API详情，ID: ${apiId}`);
      // 使用transformSingleApiToMCP转换数据
      return transformSingleApiToMCP(response.data.data);
    } else {
      throw new Error(
        `获取API详情失败: ${
          response.data?.message || response.data?.msg || "未知错误"
        }`
      );
    }
  } catch (error) {
    logError(`获取API详情失败，ID: ${apiId}`, error);
    throw error;
  }
}

/**
 * 获取项目的模块列表
 * @param {string} projectId - 项目ID
 * @returns {Promise<Array>} 模块列表
 */
async function getProjectModules(projectId = DEFAULT_PROJECT_ID) {
  try {
    if (!projectId) {
      projectId = DEFAULT_PROJECT_ID;
    }

    const client = createTornaClient();

    // 调用Torna获取模块列表，确保路径格式正确
    const response = await client.get("module/list", {
      params: {
        projectId: projectId,
      },
    });

    // 检查响应
    if (response.data && response.data.code === "0") {
      return response.data.data || [];
    } else {
      throw new Error(
        `Torna API错误: ${
          response.data?.message || response.data?.msg || "未知错误"
        }`
      );
    }
  } catch (error) {
    logError(`获取项目模块失败: ${projectId}`, error);
    throw error;
  }
}

/**
 * 获取所有API文档列表
 * @param {string} projectId - 可选，项目ID
 * @param {number} limit - 可选，限制返回的API数量
 * @returns {Promise<Array>} API列表
 */
async function getAllApiDocs(projectId = DEFAULT_PROJECT_ID, limit = 100) {
  try {
    if (!projectId) {
      projectId = DEFAULT_PROJECT_ID;
    }

    if (!limit || isNaN(parseInt(limit))) {
      limit = 100;
    } else {
      limit = parseInt(limit);
    }

    logInfo(`获取所有API，项目ID: ${projectId}, 限制: ${limit}`);

    const client = createTornaClient();

    try {
      // 获取项目的模块列表
      const modules = await getProjectModules(projectId);

      if (!modules || modules.length === 0) {
        logInfo(`未找到模块，项目ID: ${projectId}`);
        return [];
      }

      logInfo(`获取到${modules.length}个模块`);
      let allApis = [];

      // 遍历每个模块获取API
      for (const module of modules) {
        try {
          if (!module || !module.id) {
            logInfo(`模块信息不完整，跳过`);
            continue;
          }

          logInfo(`获取模块API: ${module.name || module.id}`);

          // 使用正确的端点获取模块下的API列表
          const response = await client.get("doc/list", {
            params: {
              moduleId: module.id,
            },
          });

          if (
            response.data &&
            response.data.code === "0" &&
            Array.isArray(response.data.data)
          ) {
            // 处理API树结构，提取所有非文件夹的API
            const apis = extractApisFromTree(response.data.data);
            logInfo(
              `从模块 ${module.name || module.id} 中提取到 ${apis.length} 个API`
            );
            allApis = [...allApis, ...apis];
          }
        } catch (moduleError) {
          logError(`获取模块API失败: ${module.id}`, moduleError);
          // 继续处理其他模块
        }
      }

      // 为API添加模块信息
      const modulesMap = modules.reduce((map, module) => {
        map[module.id] = module.name;
        return map;
      }, {});

      allApis = allApis.map((api) => ({
        ...api,
        moduleName: api.moduleId ? modulesMap[api.moduleId] || "" : "",
      }));

      // 限制数量
      if (limit && allApis.length > limit) {
        logInfo(`限制返回API数量: ${allApis.length} -> ${limit}`);
        allApis = allApis.slice(0, limit);
      }

      // 返回简化的API列表
      logInfo(`总计返回${allApis.length}个API`);
      return allApis.map((api) => ({
        id: api.id || "",
        name: api.name || "",
        url: api.url || "",
        httpMethod: api.httpMethod || "GET",
        description: api.description || "",
        deprecated: api.deprecated === "$true$",
        moduleName: api.moduleName || "",
      }));
    } catch (innerError) {
      logError(`处理API列表失败`, innerError);
      throw new Error(`处理API列表失败: ${innerError.message}`);
    }
  } catch (error) {
    logError("获取API列表失败", error);
    throw new Error(`获取API列表失败: ${error.message}`);
  }
}

module.exports = {
  getApiDocsByName,
  getAllApiDocs,
  getProjectInfo,
  getProjectModules,
  getApiDocDetail,
};
