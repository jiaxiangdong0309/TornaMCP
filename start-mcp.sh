#!/bin/bash

# Torna MCP 服务器启动脚本

echo "正在启动 Torna MCP 服务器..."

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

# 检查MCP SDK是否已安装
if [ ! -d "node_modules/@modelcontextprotocol" ]; then
    echo "安装 MCP SDK..."
    npm install @modelcontextprotocol/sdk
fi

# 启动MCP服务器
echo "启动 MCP 服务器..."
node mcp-server.js
