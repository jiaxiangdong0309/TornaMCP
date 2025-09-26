# Torna MCP - 让AI助手读懂你的API文档

[![npm version](https://badge.fury.io/js/torna-mcp.svg)](https://badge.fury.io/js/torna-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🚀 **专为前端开发者打造** - 让Cursor、Claude等AI助手能够智能查询你的Torna接口文档

## 🎯 解决什么问题？

作为前端开发者，你是否遇到过这些烦恼：

- 📖 **查接口文档太麻烦**：需要在代码和Torna网页之间不断切换
- 🔍 **找接口效率低**：在大量接口中查找特定API很费时
- 🤔 **理解接口困难**：复杂的接口参数和返回值难以快速理解
- 💬 **无法向AI求助**：AI助手不知道你项目的接口信息

**现在，这些问题都解决了！** 🎉

## ✨ Torna MCP 能为你做什么？

### 🔥 核心功能
- **📋 批量查询接口**：一键获取项目下所有API接口列表
- **🔍 智能搜索接口**：模糊搜索快速定位目标接口（如搜索"用户登录"）
- **📖 详细接口信息**：获取完整的接口参数、返回值、示例等
- **🤖 AI助手集成**：让Cursor、Claude等AI工具理解你的API文档

### 💡 实际使用场景
```
你：使用Torna MCP 查询当前项目有哪些接口
AI：为你列出项目中的所有接口，包括接口名称、路径、方法等

你：使用Torna MCP 查询'用户登录'接口的信息
AI：找到登录相关接口，展示详细的请求参数和返回数据结构

你：使用Torna MCP 获取id为'12345'的接口信息
AI：返回指定接口的完整文档，包括参数说明、示例等
```

## 🚀 快速开始

### 第一步：安装

选择以下任一方式安装：

```bash
# 方式1：全局安装（推荐）
npm install -g torna-mcp

# 方式2：直接使用（无需安装）
npx torna-mcp --help
```

### 第二步：获取配置参数

在使用前，你需要获取三个配置参数。按照以下步骤操作：

#### 🔍 获取API URL和Token

1. **打开你的Torna网站** 并登录
2. **随便点开一个接口详情页面**
3. **打开浏览器开发者工具**（F12）
4. **切换到Network标签页**
5. **刷新页面**，找到类似 `detail?id=xxx` 的请求
6. **点击该请求**，在请求详情中：
   - **Request URL** 的域名部分就是你的 `TORNA_API_URL`
   - **Request Headers** 中找到 `token` 字段，这就是你的 `TORNA_API_TOKEN`

#### 📁 获取项目ID

在上面找到的接口详情响应中：
- **Response** 数据里的 `projectId` 字段就是你的 `TORNA_PROJECT_ID`

#### 📝 参数示例
```bash
TORNA_API_URL="https://your-torna-domain.com"
TORNA_API_TOKEN="abcd1234efgh5678..."
TORNA_PROJECT_ID="123456"
```

### 第三步：测试连接

使用获取到的参数测试连接：

```bash
torna-mcp test \
  -u "https://your-torna-domain.com" \
  -t "your-token-here" \
  -p "your-project-id"
```

如果看到 ✅ **连接成功！** 就说明配置正确了。

## ⚙️ 在AI助手中配置

### 在Cursor中使用

#### 方法1：使用npx（推荐，无需安装）

找到Cursor的MCP配置文件，添加以下配置：

```json
{
  "mcpServers": {
    "torna-mcp": {
      "command": "npx",
      "args": ["torna-mcp", "start"],
      "env": {
        "TORNA_API_URL": "https://your-torna-domain.com",
        "TORNA_API_TOKEN": "your-token-here",
        "TORNA_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

#### 方法2：全局安装后使用

如果你已经全局安装了torna-mcp：

```json
{
  "mcpServers": {
    "torna-mcp": {
      "command": "torna-mcp",
      "args": ["start"],
      "env": {
        "TORNA_API_URL": "https://your-torna-domain.com",
        "TORNA_API_TOKEN": "your-token-here",
        "TORNA_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

#### 🗂️ Cursor配置文件位置

- **macOS**: `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.cursor-mcp/config.json`
- **Windows**: `%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.cursor-mcp\config.json`
- **Linux**: `~/.config/Cursor/User\globalStorage\rooveterinaryinc.cursor-mcp\config.json`

### 快速生成配置

你也可以使用命令快速生成配置文件：

```bash
torna-mcp config -o cursor-mcp-config.json
```

然后编辑生成的文件，替换为你的实际参数。

## 🎮 如何使用

配置完成后，重启Cursor，你就可以直接与AI助手对话来查询接口信息了！

### 📋 查询项目所有接口

```
你：使用Torna MCP 查询当前项目有哪些接口

AI助手会返回：
- 接口列表
- 接口名称和路径
- HTTP方法
- 简要描述
```

### 🔍 模糊搜索接口

```
你：使用Torna MCP 查询'用户登录'接口的信息

AI助手会：
- 搜索包含"用户登录"关键词的接口
- 返回匹配的接口详情
- 显示请求参数和返回值结构
```

### 📖 精确查询接口详情

```
你：使用Torna MCP 获取id为'12345'的接口信息

AI助手会返回：
- 完整的接口文档
- 详细的参数说明
- 返回值结构
- 示例数据
```

### 💡 实用技巧

你还可以这样问：

```
"帮我查看用户相关的所有接口"
"这个项目有哪些POST接口？"
"查询订单接口的参数格式"
"获取接口ID为xxx的详细文档"
```

## 🛠️ 高级功能

### 📋 配置参数说明

| 参数 | 必需 | 说明 |
|------|------|------|
| `TORNA_API_URL` | ✅ | Torna 实例的 API 地址 |
| `TORNA_API_TOKEN` | ✅ | Torna API 访问令牌 |
| `TORNA_PROJECT_ID` | ❌ | Torna 项目 ID（可选，不提供时需在调用时指定） |

### 🔧 其他配置方式

#### 命令行参数（测试用）
```bash
torna-mcp start --url "https://your-torna-domain.com" --token "your-token" --project "project-id"
```

#### 环境变量
```bash
export TORNA_API_URL="https://your-torna-domain.com"
export TORNA_API_TOKEN="your_token_here"
export TORNA_PROJECT_ID="your_project_id"
torna-mcp start
```

## 🔧 CLI命令参考

### 基本命令

```bash
# 查看帮助
torna-mcp --help

# 查看版本
torna-mcp --version

# 生成配置文件
torna-mcp config -o my-config.json

# 测试连接
torna-mcp test -u "https://your-torna.com" -t "your-token" -p "project-id"

# 启动MCP服务器
torna-mcp start -u "https://your-torna.com" -t "your-token" -p "project-id"
```

## 🧩 支持的AI客户端

### ✅ 已测试支持
- **Cursor** - 完美支持，推荐使用
- **Claude Desktop** - 支持MCP协议的版本

### 🔄 理论支持
任何支持MCP (Model Context Protocol) 的AI客户端都可以使用本工具。

## 📚 技术细节

### MCP工具说明

| 工具名 | 功能描述 | 主要参数 |
|--------|----------|----------|
| `get_torna_api_docs` | 根据API名称模糊搜索接口 | `apiName`(必需), `projectId`(可选) |
| `list_all_torna_apis` | 列出项目下所有API接口 | `projectId`(可选), `limit`(可选) |
| `get_torna_api_detail` | 根据API ID获取详细信息 | `apiId`(必需), `projectId`(可选) |

### 数据格式
- **只读访问**：本工具只读取Torna接口数据，不会修改任何内容
- **结构化输出**：返回标准化的JSON格式，便于AI理解和处理
- **完整信息**：包含接口路径、参数、返回值、示例等完整文档

## ❓ 常见问题

### Q: 配置后AI助手没有响应？
**A:** 请检查：
1. 配置文件路径是否正确
2. 参数是否填写正确
3. 重启AI客户端
4. 使用 `torna-mcp test` 命令验证连接

### Q: 提示连接失败？
**A:** 请确认：
1. Torna网站可以正常访问
2. Token是否有效（可能过期需要重新获取）
3. 项目ID是否正确
4. 网络连接是否正常

### Q: 找不到接口？
**A:** 可能原因：
1. 项目ID不正确
2. 接口名称拼写错误（支持模糊搜索）
3. 接口可能在其他项目中

### Q: 支持哪些Torna版本？
**A:** 理论上支持所有使用标准API的Torna版本，如有兼容性问题请提交Issue。

## 🔗 相关链接

- **npm包**: https://www.npmjs.com/package/torna-mcp
- **GitHub仓库**: https://github.com/jiaxiangdong0309/TronaMCP
- **问题反馈**: https://github.com/jiaxiangdong0309/TronaMCP/issues
- **Torna官网**: https://torna.cn/
- **MCP协议**: https://modelcontextprotocol.io/

## 🤝 贡献与支持

### 贡献代码
欢迎提交PR！请遵循：
1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起Pull Request

### 问题反馈
遇到问题？请在GitHub Issues中详细描述：
- 操作系统和版本
- Node.js版本
- 错误信息截图
- 复现步骤

## 📝 更新日志

### v1.0.0 (2024-12-xx)
- 🎉 **首次发布**
- ✅ 支持标准MCP协议
- 🔍 支持接口模糊搜索
- 📋 支持批量接口查询
- 📖 支持详细接口信息获取
- 🛠️ 提供完整CLI工具
- 📚 完善的使用文档

## 📄 许可证

MIT License - 自由使用，欢迎贡献！

---

**🚀 开始使用Torna MCP，让AI助手成为你的API文档专家！**

如果这个工具对你有帮助，请给个 ⭐️ Star 支持一下！
