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

TornaMCP 支持两种配置方式：环境变量配置和 MCP 配置文件配置。

### 方式一：环境变量配置（本地开发）

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

# 服务器配置
PORT=0330
HOST=localhost
LOG_LEVEL=INFO
```

### 方式二：MCP 配置文件配置（推荐）

这是推荐的方式，类似于 GitHub MCP 的配置方法，用户可以在 MCP 配置文件中直接设置参数。

#### Docker 方式

在你的 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "TornaMCP": {
      "command": "docker run -i --rm -e TORNA_API_URL -e TORNA_API_TOKEN -e TORNA_PROJECT_ID jiaxiangdong0309/tornamcp:latest",
      "env": {
        "TORNA_API_URL": "https://your-torna-instance.com",
        "TORNA_API_TOKEN": "your-api-token-here",
        "TORNA_PROJECT_ID": "your-project-id-here"
      },
      "args": []
    }
  }
}
```

#### 本地运行方式

```json
{
  "mcpServers": {
    "TornaMCP": {
      "command": "node",
      "args": ["mcp-server.js"],
      "env": {
        "TORNA_API_URL": "https://your-torna-instance.com",
        "TORNA_API_TOKEN": "your-api-token-here",
        "TORNA_PROJECT_ID": "your-project-id-here"
      }
    }
  }
}
```

**注意**：请将配置中的 `your-torna-instance.com`、`your-api-token-here`、`your-project-id-here` 等替换为你的实际配置值。

### 配置参数说明

- `TORNA_API_URL`: Torna 实例的 API 地址（必需）
- `TORNA_API_TOKEN`: Torna API 访问令牌（必需）
- `TORNA_PROJECT_ID`: Torna 项目 ID（可选，如果不提供，需要在调用时指定）

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
GET http://localhost:0330/mcp/tools
```

返回可用的 MCP 工具定义。

### 查询 API 文档

```
POST http://localhost:0330/mcp/invoke/get_torna_api_docs
Content-Type: application/json

{
  "apiName": "登录"
}
```

通过 API 名称关键词查询相关接口文档。

### 获取所有 API 列表

```
POST http://localhost:0330/mcp/invoke/list_all_torna_apis
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
    "http://localhost:0330/mcp/invoke/get_torna_api_docs",
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
