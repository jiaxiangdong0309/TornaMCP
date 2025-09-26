FROM node:18-alpine

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 设置环境变量（用户可以通过docker run -e覆盖）
ENV TORNA_API_URL=""
ENV TORNA_API_TOKEN=""
ENV TORNA_PROJECT_ID=""

# 启动MCP服务
CMD ["npm", "start"]