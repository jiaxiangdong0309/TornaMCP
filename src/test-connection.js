/**
 * Torna API连接测试脚本
 */
const axios = require("axios");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// Torna配置
const TORNA_API_URL = process.env.TORNA_API_URL;
const TORNA_API_TOKEN = process.env.TORNA_API_TOKEN;
const TORNA_PROJECT_ID = process.env.TORNA_PROJECT_ID;

// 测试连接
async function testTornaConnection() {
  console.log("开始测试Torna API连接...");
  console.log(`API URL: ${TORNA_API_URL}`);
  console.log(`项目ID: ${TORNA_PROJECT_ID}`);

  try {
    // 创建请求客户端
    const client = axios.create({
      baseURL: TORNA_API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TORNA_API_TOKEN}`,
      },
    });

    // 尝试请求项目信息
    console.log("尝试获取API列表...");
    const response = await client.post("/doc/list", {
      projectId: TORNA_PROJECT_ID,
      limit: 5, // 只获取5条数据
    });

    // 检查响应
    if (response.data && response.data.code === "0") {
      console.log("连接成功! 响应数据:");
      console.log("--------------------");

      const apiList = response.data.data || [];
      console.log(`获取到${apiList.length}个API:`);

      apiList.forEach((api, index) => {
        console.log(`${index + 1}. ${api.name} - ${api.httpMethod} ${api.url}`);
      });

      console.log("--------------------");
      console.log("配置正确，可以开始使用TronaMCP服务了!");
    } else {
      console.error("API返回错误:", response.data);
    }
  } catch (error) {
    console.error("连接测试失败!");

    if (error.response) {
      // 服务器返回错误
      console.error(`状态码: ${error.response.status}`);
      console.error("响应数据:", error.response.data);
    } else if (error.request) {
      // 请求发送但没有收到响应
      console.error(
        "没有收到服务器响应。请检查API URL是否正确，以及网络连接是否正常。"
      );
    } else {
      // 请求设置时出错
      console.error("请求错误:", error.message);
    }

    console.error("请检查配置信息是否正确。");
  }
}

// 执行测试
testTornaConnection();
