@echo off
echo ===============================================
echo          Torna MCP 启动脚本
echo ===============================================

REM 检查Node.js是否安装
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未安装Node.js, 请先安装Node.js (https://nodejs.org/)
    exit /b 1
)

REM 安装依赖
echo 正在安装依赖...
call npm install

REM 检查.env文件是否存在
if not exist .env (
    echo 警告: 未找到.env文件，将使用默认配置
    if exist .env.example (
        copy .env.example .env
        echo 已从.env.example创建.env文件，请检查并更新配置
    )
)

REM 测试Torna连接
echo 正在测试Torna API连接...
call node src/test-connection.js

if %ERRORLEVEL% neq 0 (
    echo Torna连接测试失败，但仍将尝试启动服务...
    echo 请检查.env文件中的配置是否正确
    set /p confirm=是否继续启动服务? (y/n):
    if not "%confirm%"=="y" (
        echo 已取消启动
        exit /b 1
    )
)

REM 启动服务
echo 正在启动Torna MCP服务...
call npm start