# 1. Chọn phiên bản Node.js (nên chọn bản LTS ổn định)
FROM node:20-alpine

# 2. Tạo thư mục làm việc bên trong container
WORKDIR /app

# 3. Copy file quản lý thư viện vào trước để cache (tối ưu thời gian build)
COPY package*.json ./

# 4. Cài đặt các thư viện
RUN npm install --production

# 5. Copy toàn bộ code còn lại vào container
COPY . .

# 6. Mở cổng mạng (Render sẽ tự động map cổng này)
EXPOSE 3000

# 7. Lệnh để khởi chạy server (Thay "server.js" bằng file chạy chính của bạn, ví dụ: index.js, app.js)
CMD ["node", "server.js"]