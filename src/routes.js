const {
  getApiDocsByName,
  getAllApiDocs,
  getApiDocDetail,
} = require("./services/tornaService");
const { validateApiRequest } = require("./utils/validator");
const { logError, logInfo } = require("./utils/logger");

/**
 * 初始化路由
 * @param {Express} app - Express应用实例
 */
function initializeRoutes(app) {
  // MCP工具定义端点
  app.get("/mcp/tools", (req, res) => {
    res.json({
      tools: [
        {
          name: "get_torna_api_docs",
          description: "获取Torna中的API接口文档信息",
          parameters: {
            properties: {
              apiName: {
                type: "string",
                description: "API名称或关键词",
              },
              projectId: {
                type: "string",
                description: "可选，Torna项目ID",
              },
            },
            required: ["apiName"],
          },
        },
        {
          name: "list_all_torna_apis",
          description: "列出所有可用的Torna API接口",
          parameters: {
            properties: {
              projectId: {
                type: "string",
                description: "可选，Torna项目ID",
              },
              limit: {
                type: "number",
                description: "可选，限制返回的API数量",
              },
            },
            required: [],
          },
        },
        {
          name: "get_api_detail",
          description: "根据ID获取API详细信息",
          parameters: {
            properties: {
              apiId: {
                type: "string",
                description: "API的唯一ID",
              },
            },
            required: ["apiId"],
          },
        },
      ],
    });
  });

  // 获取特定API的文档
  app.post("/mcp/invoke/get_torna_api_docs", async (req, res) => {
    try {
      const { apiName, projectId } = req.body;

      if (!validateApiRequest(apiName)) {
        return res.status(400).json({
          error: "无效的API名称参数",
        });
      }

      logInfo(`查询API文档: ${apiName}`);

      try {
        const apiDocs = await getApiDocsByName(apiName, projectId);
        res.json({
          result: apiDocs,
        });
      } catch (error) {
        logError(`获取API文档失败: ${error.message}`);
        res.status(500).json({
          error: "查询Torna API文档失败",
          message: error.message,
        });
      }
    } catch (error) {
      logError("查询API文档失败", error);
      res.status(500).json({
        error: "查询Torna API文档失败",
        message: error.message,
      });
    }
  });

  // 获取所有API列表
  app.post("/mcp/invoke/list_all_torna_apis", async (req, res) => {
    try {
      const { projectId, limit } = req.body;

      logInfo(`获取所有API列表`);

      try {
        const allApis = await getAllApiDocs(projectId, limit);
        res.json({
          result: allApis,
        });
      } catch (error) {
        logError(`获取API列表失败: ${error.message}`);
        res.status(500).json({
          error: "获取Torna API列表失败",
          message: error.message,
        });
      }
    } catch (error) {
      logError("获取API列表失败", error);
      res.status(500).json({
        error: "获取Torna API列表失败",
        message: error.message,
      });
    }
  });

  // 新增：根据ID获取API详情
  app.post("/mcp/invoke/get_api_detail", async (req, res) => {
    try {
      const { apiId } = req.body;

      if (!apiId) {
        return res.status(400).json({
          error: "API ID是必须的",
        });
      }

      logInfo(`获取API详情，ID: ${apiId}`);

      try {
        const apiDetail = await getApiDocDetail(apiId);
        res.json({
          result: apiDetail,
        });
      } catch (error) {
        logError(`获取API详情失败: ${error.message}`);
        res.status(500).json({
          error: "获取API详情失败",
          message: error.message,
        });
      }
    } catch (error) {
      logError("获取API详情失败", error);
      res.status(500).json({
        error: "获取API详情失败",
        message: error.message,
      });
    }
  });

  // 健康检查端点
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 根路径
  app.get("/", (req, res) => {
    res.json({
      name: "Torna MCP",
      description: "通过MCP获取Torna接口文档的适配器",
      endpoints: [
        "/mcp/tools - 获取可用工具定义",
        "/mcp/invoke/get_torna_api_docs - 查询特定API文档",
        "/mcp/invoke/list_all_torna_apis - 获取所有API列表",
        "/mcp/invoke/get_api_detail - 根据ID获取API详细信息",
      ],
    });
  });
}

module.exports = { initializeRoutes };
