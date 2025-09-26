/**
 * 测试MCP API接口
 * 模拟前端应用如何调用TronaMCP服务
 */

const axios = require("axios");

// MCP服务配置
const MCP_SERVICE_URL = "http://localhost:3000"; // 本地运行的TronaMCP服务

/**
 * 测试MCP工具定义
 */
async function testMCPToolDefinition() {
  try {
    console.log("测试获取MCP工具定义...");
    const response = await axios.get(`${MCP_SERVICE_URL}/mcp/tools`);

    console.log("✅ 成功获取MCP工具定义");
    console.log("工具列表:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error("❌ 获取MCP工具定义失败:", error.message);

    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("响应数据:", error.response.data);
    }

    return null;
  }
}

/**
 * 测试获取API文档
 */
async function testGetApiDocs(apiName) {
  try {
    console.log(`\n测试获取API文档 (名称: ${apiName})...`);
    const response = await axios.post(
      `${MCP_SERVICE_URL}/mcp/invoke/get_torna_api_docs`,
      {
        apiName: apiName,
      }
    );

    console.log("✅ 成功获取API文档");
    console.log("API文档:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error("❌ 获取API文档失败:", error.message);

    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("响应数据:", error.response.data);
    }

    return null;
  }
}

/**
 * 测试获取所有API列表
 */
async function testListAllApis(limit = 10) {
  try {
    console.log(`\n测试获取所有API列表 (限制: ${limit})...`);
    const response = await axios.post(
      `${MCP_SERVICE_URL}/mcp/invoke/list_all_torna_apis`,
      {
        limit: limit,
      }
    );

    console.log("✅ 成功获取API列表");
    console.log(`获取到 ${response.data.result.length} 个API:`);

    // 显示前5个API
    const previewLimit = Math.min(5, response.data.result.length);
    for (let i = 0; i < previewLimit; i++) {
      const api = response.data.result[i];
      console.log(`${i + 1}. ${api.name} - ${api.httpMethod} ${api.url}`);
    }

    return response.data;
  } catch (error) {
    console.error("❌ 获取API列表失败:", error.message);

    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("响应数据:", error.response.data);
    }

    return null;
  }
}

/**
 * 测试健康检查端点
 */
async function testHealthCheck() {
  try {
    console.log("\n测试健康检查端点...");
    const response = await axios.get(`${MCP_SERVICE_URL}/health`);

    console.log("✅ 健康检查成功");
    console.log("状态:", response.data.status);

    return response.data;
  } catch (error) {
    console.error("❌ 健康检查失败:", error.message);

    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("响应数据:", error.response.data);
    }

    return null;
  }
}

/**
 * 测试根路径端点
 */
async function testRootEndpoint() {
  try {
    console.log("\n测试根路径端点...");
    const response = await axios.get(`${MCP_SERVICE_URL}/`);

    console.log("✅ 访问根路径成功");
    console.log("响应数据:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error("❌ 访问根路径失败:", error.message);

    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("响应数据:", error.response.data);
    }

    return null;
  }
}

/**
 * 测试通过ID获取API详情
 */
async function testGetApiDetail() {
  console.log("\n测试通过ID获取API详情...");
  try {
    // 使用单点登录API的ID来测试
    const apiId = "d8xN3Myz";
    const response = await axios.post(
      `${MCP_SERVICE_URL}/mcp/invoke/get_api_detail`,
      {
        apiId: apiId,
      }
    );

    if (response.status === 200 && response.data) {
      console.log("✅ 获取API详情成功");
      const apiDetail = response.data.result;
      console.log("API名称:", apiDetail.name);
      console.log("请求方法:", apiDetail.httpMethod);
      console.log("URL路径:", apiDetail.url);
      console.log("API描述:", apiDetail.description);

      // 打印入参信息
      if (apiDetail.requestParams && apiDetail.requestParams.length > 0) {
        console.log("\n请求参数:");
        apiDetail.requestParams.forEach((param) => {
          console.log(
            `- ${param.name} (${param.type}): ${param.description} ${
              param.required ? "[必填]" : "[可选]"
            }`
          );
        });
      }

      // 打印请求头信息
      if (apiDetail.headerParams && apiDetail.headerParams.length > 0) {
        console.log("\n请求头参数:");
        apiDetail.headerParams.forEach((param) => {
          console.log(
            `- ${param.name} (${param.type}): ${param.description} ${
              param.required ? "[必填]" : "[可选]"
            }`
          );
        });
      }

      // 打印出参信息
      if (apiDetail.responseParams && apiDetail.responseParams.length > 0) {
        console.log("\n响应参数:");
        apiDetail.responseParams.forEach((param) => {
          console.log(`- ${param.name} (${param.type}): ${param.description}`);
        });
      }
    } else {
      console.error("❌ 获取API详情失败");
      console.error("状态码:", response.status);
      console.error("响应数据:", response.data);
    }
  } catch (error) {
    console.error("❌ 获取API详情失败:", error.message);
    console.error("状态码:", error.response?.status);
    console.error("响应数据:", error.response?.data);
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log("=================================================");
  console.log("         MCP API接口测试                       ");
  console.log("=================================================");
  console.log(`MCP服务URL: ${MCP_SERVICE_URL}`);
  console.log("-------------------------------------------------");

  console.log("\n注意: 确保已经启动TronaMCP服务(npm start)\n");

  // 测试健康检查
  await testHealthCheck();

  // 测试根路径
  await testRootEndpoint();

  // 测试MCP工具定义
  await testMCPToolDefinition();

  // 测试获取特定API文档
  await testGetApiDocs("登录");

  // 测试获取所有API列表
  await testListAllApis(5);

  // 测试通过ID获取API详情
  await testGetApiDetail();

  console.log("\n=================================================");
  console.log("测试完成!");
  console.log("=================================================");
}

// 执行测试
runAllTests().catch(console.error);
