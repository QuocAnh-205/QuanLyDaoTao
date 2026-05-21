Triển khai dự án **University IT Management System (stdmanager)**.

Dưới đây là hướng dẫn chi tiết từng bước để chạy dự án này trên môi trường local, bao gồm Database (Docker), Backend (Spring Boot) và Frontend (React Vite).

### 📋 Yêu cầu hệ thống
*   **Docker & Docker Compose**
*   **Java 17 hoặc 21** (Dự án dùng Spring Boot 3)
*   **Node.js** (Phiên bản LTS) và **npm**
*   **Maven** (Đã có sẵn `mvnw` trong thư mục backend)

---

### 🚀 Các bước triển khai

#### Bước 1: Khởi động Database (Docker)
Dự án sử dụng SQL Server 2022. Cần khởi động container trước để Backend có chỗ lưu trữ dữ liệu.

1.  Mở terminal tại thư mục gốc của dự án.
2.  Di chuyển vào thư mục docker:
    ```bash
    cd docker
    ```
3.  Khởi chạy container:
    ```bash

    docker compose down -v
    docker compose up -d

    ```
4.  **Quan trọng:** Sau khi SQL Server chạy, cần tạo database tên là `stdmanager_db`. Chạy lệnh sau để tạo nhanh:
    ```bash
    
    docker exec -it uni_it_sqlserver /opt/mssql-tools18/bin/sqlcmd `
    -S 127.0.0.1 -U sa -P UniItAdmin2026 `
    -C -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'stdmanager_db') CREATE DATABASE stdmanager_db"

    ```

#### Bước 2: Chạy Backend (Spring Boot)
Backend sẽ tự động tạo bảng dữ liệu (nhờ Flyway Migration) khi khởi động lần đầu.

1.  Mở một terminal mới tại thư mục gốc dự án.
2.  Di chuyển vào thư mục backend:
    ```bash
    cd stdmanager
    ```
3.  Chạy ứng dụng:
    ```bash

    mvn clean

    mvn spring-boot:run

    ```
    *   **Cổng mặc định:** `8080`
    *   **Tài liệu API (Swagger):** Sau khi chạy xong, có thể xem tại [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)


#### Bước 3: Chạy Frontend (React + Vite)
Frontend được xây dựng bằng React và TailwindCSS.

1.  Mở một terminal mới tại thư mục gốc dự án.
2.  Di chuyển vào thư mục frontend:
    ```bash
    cd frontend
    ```
3.  Cài đặt các thư viện (chỉ cần làm lần đầu):
    ```bash
    npm install
    ```
4.  Khởi chạy môi trường phát triển:
    ```bash
    npm run dev
    ```
    *   **Cổng mặc định:** Thường là `5173`. Truy cập tại [http://localhost:5173](http://localhost:5173)

---

### 🔑 Thông tin đăng nhập mặc định
*   **Admin:** `admin` / `Admin@123` (hoặc kiểm tra trong file migration `V1__...` trong thư mục `stdmanager/src/main/resources/db/migration`)

### 🛠️ Các lỗi thường gặp
1.  **Lỗi kết nối DB:** Đảm bảo Docker container `uni_it_sqlserver` đang chạy và đã tạo database `stdmanager_db` ở Bước 1.
2.  **Lỗi cổng 8080 bị chiếm dụng:** Nếu đang chạy ứng dụng khác ở cổng 8080, hãy đổi cổng trong file `stdmanager/src/main/resources/application.yaml`.

