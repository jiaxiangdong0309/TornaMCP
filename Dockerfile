FROM node:18-alpine

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 设置环境变量（可选，用户可以通过docker run -e覆盖）
ENV TORNA_API_URL=""
ENV TORNA_API_TOKEN=""
ENV TORNA_PROJECT_ID=""

# 暴露端口
EXPOSE 0330

# 启动应用
CMD ["npm", "start"]