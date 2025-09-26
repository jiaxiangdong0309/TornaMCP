# Torna MCP

通过 Model Context Protocol (MCP)获取 Torna 接口文档的适配器。

## 功能特点

- 支持通过 MCP 协议获取 Torna 接口信息
- 针对前端开发者提供结构化的客户端 API 文档访问能力
- 易于与 LLM 模型集成，提供智能 API 查询能力

## 安装

```bash
# 安装依赖
npm install
```

## 配置

### 环境变量配置

1. 复制环境变量模板文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 Torna 配置信息：
```
# Torna 配置
TORNA_API_URL=https://your-torna-instance.com/api
TORNA_API_TOKEN=your_token_here
TORNA_PROJECT_ID=your_project_id
TORNA_SPACE_ID=your_space_id

# 服务器配置
PORT=3000
HOST=localhost
LOG_LEVEL=INFO
```

**注意**：请将 `your_token_here`、`your_project_id` 等替换为你的实际配置值。

## 测试连接

在启动服务前，可以测试与 Torna API 的连接：

```bash
# 测试Torna服务连接
node test-service.js
```

## 运行

```bash
# 启动服务
npm start
```

或者使用提供的启动脚本（更简便）：

```bash
# Mac/Linux
chmod +x start.sh
./start.sh

# Windows
start.bat
```

## 使用方法

启动服务后，可以通过以下 MCP 接口访问 Torna 文档：

### MCP 工具定义

```
GET http://localhost:3000/mcp/tools
```

返回可用的 MCP 工具定义。

### 查询 API 文档

```
POST http://localhost:3000/mcp/invoke/get_torna_api_docs
Content-Type: application/json

{
  "apiName": "登录"
}
```

通过 API 名称关键词查询相关接口文档。

### 获取所有 API 列表

```
POST http://localhost:3000/mcp/invoke/list_all_torna_apis
Content-Type: application/json

{
  "limit": 10
}
```

获取所有可用 API 的列表。

## 客户端集成示例

```javascript
// 使用axios调用MCP服务
const axios = require("axios");

// 查询API文档
async function getApiDoc(apiName) {
  const response = await axios.post(
    "http://localhost:3000/mcp/invoke/get_torna_api_docs",
    {
      apiName: apiName,
    }
  );

  return response.data.result;
}

// 使用示例
getApiDoc("登录")
  .then((doc) => {
    console.log("API文档:", doc);
  })
  .catch((err) => {
    console.error("获取API文档失败:", err);
  });
```

## 测试 MCP 接口

可以使用提供的测试脚本来测试 MCP 接口功能：

```bash
# 启动服务
npm start

# 另一个终端中执行测试
node test-mcp-api.js    # 测试MCP API接口
node test-service.js    # 测试Torna服务连接
```

## 许可证

MIT
