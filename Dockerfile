# 使用 Node 20
FROM node:20

# 設定工作目錄
WORKDIR /app

# 複製並安裝依賴
COPY package*.json ./
RUN yarn install

# 複製所有檔案
COPY . .

# build 專案（重要）
RUN yarn run build

# 使用 production start 模式
EXPOSE 3000
CMD ["yarn", "run", "start"]
