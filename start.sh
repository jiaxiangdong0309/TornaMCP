#!/bin/bash

# Torna MCP 启动脚本

echo "==============================================="
echo "         Torna MCP 启动脚本                    "
echo "==============================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未安装Node.js, 请先安装Node.js (https://nodejs.org/)"
    exit 1
fi

# 安装依赖
echo "正在安装依赖..."
npm install

# 检查.env文件是否存在
if [ ! -f .env ]; then
    echo "警告: 未找到.env文件，将使用默认配置"
    # 复制示例配置
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "已从.env.example创建.env文件，请检查并更新配置"
    fi
fi

# 测试Torna连接
echo "正在测试Torna API连接..."
node src/test-connection.js

if [ $? -ne 0 ]; then
    echo "Torna连接测试失败，但仍将尝试启动服务..."
    echo "请检查.env文件中的配置是否正确"
    read -p "是否继续启动服务? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "已取消启动"
        exit 1
    fi
fi

# 启动服务
echo "正在启动Torna MCP服务..."
npm start