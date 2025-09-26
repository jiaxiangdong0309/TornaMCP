/**
 * Torna 服务测试脚本
 * 直接执行：node test-service.js
 */

require("dotenv").config(); // 加载.env文件中的环境变量
const {
  getProjectInfo,
  getProjectModules,
  getAllApiDocs,
  getApiDocsByName,
} = require("./src/services/tornaService");

async function testTornaService() {
  console.log("=================================================");
  console.log("            Torna 服务测试                      ");
  console.log("=================================================");

  try {
    // 1. 测试获取项目信息
    console.log("\n1. 测试获取项目信息...");
    const projectInfo = await getProjectInfo();
    console.log("项目信息:", projectInfo);

    // 2. 测试获取项目模块
    console.log("\n2. 测试获取项目模块...");
    const modules = await getProjectModules();
    console.log(`获取到 ${modules.length} 个模块:`);
    modules.forEach((module, index) => {
      console.log(`${index + 1}. ${module.name} (ID: ${module.id})`);
    });

    if (modules.length > 0) {
      // 3. 测试获取所有API文档
      console.log("\n3. 测试获取所有API文档 (限制5条)...");
      const allApis = await getAllApiDocs(undefined, 5);
      console.log(`获取到 ${allApis.length} 个API:`);
      allApis.forEach((api, index) => {
        console.log(`${index + 1}. ${api.name} - ${api.httpMethod} ${api.url}`);
      });

      // 4. 测试通过名称搜索API
      console.log("\n4. 测试通过名称搜索API (关键词: user)...");
      const searchResult = await getApiDocsByName("user");

      if (searchResult.apis) {
        console.log(`找到 ${searchResult.apis.length} 个匹配的API:`);
        searchResult.apis.forEach((api, index) => {
          console.log(
            `${index + 1}. ${api.name} - ${api.httpMethod} ${api.url}`
          );
        });
      } else {
        console.log("搜索结果:", searchResult);
      }
    }

    console.log("\n=================================================");
    console.log("✅ 测试完成! Torna服务正常工作");
    console.log("=================================================");
  } catch (error) {
    console.error("\n=================================================");
    console.error("❌ 测试失败!", error.message);
    console.error("=================================================");
  }
}

// 执行测试
testTornaService().catch((err) => {
  console.error("测试执行错误:", err);
});
