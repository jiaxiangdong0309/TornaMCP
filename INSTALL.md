# 🚀 快速安装指南

## 一键安装

```bash
npm install -g torna-mcp
```

## 快速配置

### 1. 生成配置文件
```bash
torna-mcp config -o mcp-config.json
```

### 2. 获取配置参数
- 打开Torna网站 → 接口详情页 → F12开发者工具 → 找到`detail?id=xxx`请求
- 从请求中提取URL、Token和ProjectID

### 3. 测试连接
```bash
torna-mcp test -u "your-url" -t "your-token" -p "project-id"
```

### 4. 在Cursor中使用
将生成的配置文件内容添加到Cursor的MCP配置中，重启即可使用！

## 使用示例

```
你：使用Torna MCP 查询当前项目有哪些接口
AI：[返回项目所有接口列表]

你：使用Torna MCP 查询'用户登录'接口的信息
AI：[返回登录接口详细信息]
```

更多详情请查看完整的README文档。
