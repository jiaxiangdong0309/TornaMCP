const express = require("express");
const dotenv = require("dotenv");
const { initializeRoutes } = require("./routes");
const { logInfo } = require("./utils/logger");

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 0330;
const HOST = process.env.HOST || "localhost";

// 中间件
app.use(express.json());

// 初始化路由
initializeRoutes(app);

// 启动服务器
app.listen(PORT, () => {
  logInfo(`服务已启动: http://${HOST}:${PORT}`);
  logInfo("Torna MCP适配器准备就绪");
});
