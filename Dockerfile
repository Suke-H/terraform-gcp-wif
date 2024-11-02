# Stage 1: Build
FROM node:20.11.1-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# プロジェクトファイルをコピー
COPY . .

# プロジェクトをビルド
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Nginxのデフォルト設定を削除
RUN rm -rf /usr/share/nginx/html/*

# ビルドされたファイルをコピー
COPY --from=builder /app/dist /usr/share/nginx/html/game_pages

# Nginx設定ファイルをコピー
COPY default.conf /etc/nginx/conf.d/default.conf

# コンテナを起動するコマンド
CMD ["nginx", "-g", "daemon off;"]

# Nginxが使用するポートを公開
EXPOSE 8080
