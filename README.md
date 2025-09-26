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

直接设置环境变量：
```bash
export TORNA_API_URL="https://your-torna-instance.com"
export TORNA_API_TOKEN="your_token_here"
export TORNA_PROJECT_ID="your_project_id"
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

## 运行

### 本地运行
```bash
# 安装依赖
npm install

# 启动MCP服务
npm start
```

### Docker运行
```bash
# 构建镜像
docker build -t tornamcp .

# 运行容器
docker run -i --rm \
  -e TORNA_API_URL="https://your-torna-instance.com" \
  -e TORNA_API_TOKEN="your_token_here" \
  -e TORNA_PROJECT_ID="your_project_id" \
  tornamcp
```

## 使用方法

TornaMCP作为标准MCP服务运行，通过stdio协议与MCP客户端通信。

### 可用工具

1. **get_torna_api_docs** - 根据API名称获取接口文档
2. **list_all_torna_apis** - 列出所有可用的API接口
3. **get_torna_api_detail** - 根据API ID获取详细信息

### MCP客户端集成

在支持MCP的客户端（如Claude Desktop）中配置TornaMCP服务即可使用。

## 测试

```bash
# 测试Torna服务连接
node test-service.js
```

## 许可证

MIT
