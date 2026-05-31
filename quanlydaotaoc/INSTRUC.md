# 📘 Hướng dẫn Triển khai & Cài đặt — University IT Management System (stdmanager)

> Tài liệu hướng dẫn chi tiết từng bước để thiết lập và chạy dự án **stdmanager** trên môi trường local.
> Bao gồm: Database (Docker + SQL Server), Backend (Spring Boot 4), Frontend (React 19 + Vite 8).

---

## 📑 Mục lục

1.  [Tổng quan Kiến trúc Hệ thống](#-1-tổng-quan-kiến-trúc-hệ-thống)
2.  [Yêu cầu Hệ thống (Prerequisites)](#-2-yêu-cầu-hệ-thống-prerequisites)
3.  [Cấu trúc Thư mục Dự án](#-3-cấu-trúc-thư-mục-dự-án)
4.  [Bước 1 — Khởi động Database (Docker)](#-bước-1--khởi-động-database-docker)
5.  [Bước 2 — Chạy Backend (Spring Boot)](#-bước-2--chạy-backend-spring-boot)
6.  [Bước 3 — Chạy Frontend (React + Vite)](#-bước-3--chạy-frontend-react--vite)
7.  [Cấu hình Biến Môi trường (Environment Variables)](#-4-cấu-hình-biến-môi-trường)
8.  [Flyway Migration — Quản lý Schema Tự động](#-5-flyway-migration--quản-lý-schema-tự-động)
9.  [Tài khoản Đăng nhập Mặc định](#-6-tài-khoản-đăng-nhập-mặc-định)
10. [Ma trận Phân quyền (RBAC Permission Matrix)](#-7-ma-trận-phân-quyền-rbac)
11. [Swagger API Documentation](#-8-swagger-api-documentation)
12. [Xử lý Sự cố & Lỗi Thường gặp](#-9-xử-lý-sự-cố--lỗi-thường-gặp)
13. [Phụ lục — Công nghệ & Tài liệu Tham khảo](#-10-phụ-lục--công-nghệ--tài-liệu-tham-khảo)

---

## 🏛️ 1. Tổng quan Kiến trúc Hệ thống

Hệ thống được thiết kế theo mô hình **3-tier (Client → Server → Database)**, tách biệt hoàn toàn giữa các tầng:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│          React 19 + Vite 8 + TailwindCSS 4 + Zustand           │
│                     http://localhost:5173                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP / REST API (JSON)
                            │  Authorization: Bearer <JWT>
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION SERVER                          │
│         Spring Boot 4.0.6 + Spring Security + JPA              │
│         Flyway Migration + Swagger (OpenAPI 3)                 │
│                     http://localhost:8080                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │  JDBC / JPA (Hibernate 6)
                            │  jdbc:sqlserver://localhost:1433
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE SERVER                          │
│          Microsoft SQL Server 2022 (Docker Container)          │
│          Container: uni_it_sqlserver — Port: 1433              │
│          Database: stdmanager_db                               │
└─────────────────────────────────────────────────────────────────┘
```

**Luồng hoạt động chính:**
1.  Người dùng truy cập giao diện Frontend qua trình duyệt.
2.  Frontend gửi HTTP request kèm JWT Token đến Backend API.
3.  Backend xác thực Token, kiểm tra quyền hạn (RBAC), xử lý nghiệp vụ.
4.  Backend truy vấn / cập nhật dữ liệu thông qua JPA → SQL Server.
5.  Kết quả được trả về Frontend dưới dạng JSON chuẩn hóa (`ApiResponse`).

---

## 📋 2. Yêu cầu Hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt đầy đủ các phần mềm sau:

| Phần mềm              | Phiên bản tối thiểu | Mục đích                                       | Kiểm tra cài đặt            |
|------------------------|---------------------|-------------------------------------------------|------------------------------|
| **Docker Desktop**     | 4.x                | Chạy SQL Server trong container                 | `docker --version`           |
| **Docker Compose**     | 2.x (tích hợp)     | Điều phối container từ file YAML                | `docker compose version`     |
| **Java JDK**           | **21** (bắt buộc)  | Runtime cho Spring Boot 4.0.6                   | `java -version`              |
| **Apache Maven**       | 3.9+               | Build & quản lý dependency (có sẵn `mvnw`)      | `mvn -version`               |
| **Node.js**            | 18 LTS hoặc 20 LTS | Runtime cho Frontend (React + Vite)             | `node -v`                    |
| **npm**                | 9+                 | Quản lý package JavaScript                      | `npm -v`                     |
| **Git**                | 2.x                | Quản lý mã nguồn                                | `git --version`              |

> **⚠️ Lưu ý quan trọng:**
> - Dự án sử dụng **Spring Boot 4.0.6** với **Java 21**. Nếu dùng Java 17 có thể phát sinh lỗi tương thích.
> - Docker Desktop cần được **khởi động trước** khi thực hiện Bước 1.
> - Trên Windows, đảm bảo **WSL 2** đã được bật nếu dùng Docker Desktop.

---

## 📂 3. Cấu trúc Thư mục Dự án

```
quanlydaotaoc/                          ← Thư mục gốc dự án
│
├── .env                                 ← Biến môi trường (DB host, port, credentials)
├── README.md                            ← Tài liệu tổng quan dự án
├── INSTRUC.md                           ← 📌 Tài liệu này — Hướng dẫn cài đặt
│
├── docker/                              ← Cấu hình Docker
│   └── docker-compose.yml               ← Định nghĩa SQL Server container
│
├── stdmanager/                          ← 🔧 Backend (Spring Boot 4)
│   ├── pom.xml                          ← Maven dependencies & build config
│   ├── mvnw / mvnw.cmd                  ← Maven Wrapper (chạy không cần cài Maven)
│   ├── Dockerfile                       ← Docker image cho Backend (nếu deploy)
│   └── src/
│       └── main/
│           ├── java/uni/it/stdmanager/
│           │   ├── StdmanagerApplication.java    ← Entry point
│           │   ├── core/                          ← Hạ tầng dùng chung
│           │   │   ├── config/                    ← SecurityConfig, CorsConfig, ...
│           │   │   ├── dto/                       ← ApiResponse, BaseDTO
│           │   │   ├── entity/                    ← BaseEntity (auditing)
│           │   │   ├── exception/                 ← GlobalExceptionHandler
│           │   │   └── security/                  ← JwtProvider, JwtFilter, ...
│           │   └── modules/                       ← Các module nghiệp vụ
│           │       ├── i_auth/                    ← Xác thực & Phân quyền
│           │       ├── ii_student/                ← Quản lý Sinh viên
│           │       ├── iii_lecturer/              ← Quản lý Giảng viên
│           │       ├── iv_course/                 ← Quản lý Học phần
│           │       ├── v_semester/                ← Quản lý Học kỳ & Lớp HP
│           │       ├── vi_registration/           ← Đăng ký Tín chỉ
│           │       ├── vii_tuition/               ← Quản lý Học phí
│           │       ├── xii_notification/          ← Thông báo nội bộ
│           │       └── xiii_system_config/         ← Cấu hình hệ thống
│           └── resources/
│               ├── application.yaml               ← Cấu hình Spring (DB, CORS, Flyway)
│               └── db/migration/                  ← Flyway SQL scripts (V1 → V23)
│
└── frontend/                            ← 🎨 Frontend (React 19 + Vite 8)
    ├── package.json                     ← Dependencies & scripts
    ├── vite.config.js                   ← Vite build configuration
    ├── index.html                       ← HTML entry point
    └── src/
        ├── main.jsx                     ← React entry point
        ├── App.jsx                      ← Root component + Router
        ├── index.css                    ← Global styles (TailwindCSS)
        ├── api/                         ← Axios client & API modules
        │   ├── axiosClient.js           ← Interceptor (JWT auto-attach)
        │   ├── authApi.js               ← Login, /me endpoint
        │   ├── studentApi.js            ← CRUD Sinh viên
        │   ├── lecturerApi.js           ← CRUD Giảng viên
        │   ├── courseApi.js             ← Danh mục Học phần
        │   ├── semesterApi.js           ← Học kỳ & Lớp HP
        │   ├── registrationApi.js       ← Đăng ký tín chỉ
        │   ├── tuitionApi.js            ← Học phí & Công nợ
        │   ├── notificationApi.js       ← Thông báo
        │   ├── profileApi.js            ← Hồ sơ cá nhân
        │   ├── adminApi.js              ← Quản trị User
        │   ├── departmentApi.js         ← Khoa / Bộ môn
        │   └── systemConfigApi.js       ← Cấu hình hệ thống
        ├── store/                       ← Zustand state management
        │   ├── useAuthStore.js           ← Auth state + localStorage persistence
        │   └── useRegistrationStore.js   ← Registration flow state
        ├── routes/                      ← Route guards
        │   ├── ProtectedRoute.jsx       ← Yêu cầu đăng nhập
        │   └── PublicRoute.jsx          ← Chỉ cho phép khi chưa đăng nhập
        ├── layouts/                     ← Layout wrappers
        │   ├── MainLayout.jsx           ← Sidebar + Header + Content
        │   └── Sidebar.jsx             ← Dynamic menu theo role
        ├── components/                  ← Shared components
        │   ├── StudentFormModal.jsx
        │   ├── StudentDetailModal.jsx
        │   ├── StudentStatusModal.jsx
        │   ├── ClassDetailModal.jsx
        │   ├── ProfileEditModal.jsx
        │   └── ...
        └── pages/                       ← Các trang giao diện
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── ForgotPasswordPage.jsx
            ├── DashboardPage.jsx
            ├── ProfilePage.jsx
            ├── SystemConfigPage.jsx
            ├── ERDiagramView.jsx
            ├── students/                ← Quản lý SV
            ├── lecturers/               ← Quản lý GV
            ├── academic/                ← Học phần & Tín chỉ
            ├── academic-management/     ← Quản lý đào tạo
            └── finance/                 ← Tài chính & Học phí
```

---

## 🚀 Bước 1 — Khởi động Database (Docker)

Dự án sử dụng **Microsoft SQL Server 2022** chạy trong Docker container. Đây là bước **bắt buộc phải làm đầu tiên** vì Backend cần kết nối tới Database khi khởi động.

### 1.1. Kiểm tra Docker đang chạy

```bash
docker info
```

Nếu lệnh trên trả về thông tin Docker → Docker đã sẵn sàng. Nếu báo lỗi, hãy mở **Docker Desktop** và đợi đến khi biểu tượng chuyển sang màu xanh.

### 1.2. Dọn dẹp container cũ (nếu có)

Nếu đây không phải lần đầu chạy, hoặc bạn muốn reset database về trạng thái ban đầu:

```bash
cd docker
docker compose down -v
```

> Tham số `-v` sẽ **xóa toàn bộ volume** (dữ liệu cũ trong database). Bỏ `-v` nếu muốn giữ lại dữ liệu.

### 1.3. Khởi chạy SQL Server container

```bash
docker compose up -d
```

Lệnh này sẽ:
- Tải image `mcr.microsoft.com/mssql/server:2022-latest` (lần đầu mất vài phút)
- Tạo container tên `uni_it_sqlserver`
- Map cổng `1433` (SQL Server) ra máy host
- Tạo volume `mssql_data` để lưu dữ liệu persistent

### 1.4. Kiểm tra container đã chạy thành công

```bash
docker ps
```

Kết quả mong đợi:
```
CONTAINER ID   IMAGE                                        STATUS          PORTS                    NAMES
xxxxxxxxxxxx   mcr.microsoft.com/mssql/server:2022-latest   Up 30 seconds   0.0.0.0:1433->1433/tcp   uni_it_sqlserver
```

> **⏳ Chờ khoảng 15-30 giây** sau khi container `Up` để SQL Server khởi tạo xong bên trong.

### 1.5. Tạo Database `stdmanager_db`

SQL Server container mặc định **không có** database `stdmanager_db`. Cần tạo thủ công:

**Trên PowerShell (Windows):**
```powershell
docker exec -it uni_it_sqlserver /opt/mssql-tools18/bin/sqlcmd `
  -S 127.0.0.1 -U sa -P UniItAdmin2026 `
  -C -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'stdmanager_db') CREATE DATABASE stdmanager_db"
```

**Trên Bash (macOS / Linux):**
```bash
docker exec -it uni_it_sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S 127.0.0.1 -U sa -P UniItAdmin2026 \
  -C -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'stdmanager_db') CREATE DATABASE stdmanager_db"
```

### 1.6. Xác minh Database đã tạo thành công

```bash
docker exec -it uni_it_sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S 127.0.0.1 -U sa -P UniItAdmin2026 \
  -C -Q "SELECT name FROM sys.databases WHERE name = 'stdmanager_db'"
```

Kết quả mong đợi:
```
name
----------------------------------------------------------------
stdmanager_db

(1 rows affected)
```

> ✅ **Database đã sẵn sàng!** Chuyển sang Bước 2.

---

## ⚙️ Bước 2 — Chạy Backend (Spring Boot)

Backend sẽ tự động tạo toàn bộ bảng dữ liệu và dữ liệu mẫu nhờ **Flyway Migration** khi khởi động lần đầu.

### 2.1. Mở terminal mới tại thư mục gốc dự án

> ⚠️ **Quan trọng:** Giữ terminal Docker ở Bước 1 mở. Mở một terminal **mới** cho Backend.

### 2.2. Di chuyển vào thư mục Backend

```bash
cd stdmanager
```

### 2.3. Dọn dẹp build cũ (khuyến nghị)

```bash
mvn clean
```

Hoặc dùng Maven Wrapper nếu không có Maven cài đặt:
```bash
# Windows
.\mvnw.cmd clean

# macOS / Linux
./mvnw clean
```

### 2.4. Khởi chạy ứng dụng

```bash
mvn spring-boot:run
```

Hoặc dùng Maven Wrapper:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```

### 2.5. Xác minh Backend đã chạy thành công

Quan sát log trong terminal, khi thấy dòng tương tự sau nghĩa là đã thành công:

```
Started StdmanagerApplication in X.XXX seconds
Tomcat started on port 8080 (http) with context path '/'
```

**Kiểm tra nhanh bằng trình duyệt hoặc curl:**
```bash
curl http://localhost:8080/v3/api-docs
```

Nếu trả về JSON → Backend đã hoạt động.

### 2.6. Thông tin kết nối Backend

| Thuộc tính                     | Giá trị                                          |
|-------------------------------|--------------------------------------------------|
| **Base URL**                   | `http://localhost:8080`                           |
| **API Prefix**                 | `/api/v1/...`                                     |
| **Swagger UI**                 | http://localhost:8080/swagger-ui.html              |
| **API Docs (JSON)**            | http://localhost:8080/v3/api-docs                  |
| **Database kết nối**           | `jdbc:sqlserver://localhost:1433;databaseName=stdmanager_db` |

> ✅ **Backend đã sẵn sàng!** Chuyển sang Bước 3.

---

## 🎨 Bước 3 — Chạy Frontend (React + Vite)

Frontend được xây dựng bằng **React 19** với **Vite 8** làm bundler, **TailwindCSS 4** cho styling, và **Zustand** cho state management.

### 3.1. Mở terminal mới

> ⚠️ Giữ cả terminal Docker và Backend đang chạy. Mở terminal **thứ ba** cho Frontend.

### 3.2. Di chuyển vào thư mục Frontend

```bash
cd frontend
```

### 3.3. Cài đặt dependencies (chỉ cần làm lần đầu)

```bash
npm install
```

> Lệnh này sẽ đọc `package.json` và tải tất cả dependencies vào thư mục `node_modules/`.
> Thời gian cài đặt lần đầu khoảng **1-3 phút** tùy tốc độ mạng.

### 3.4. Khởi chạy Development Server

```bash
npm run dev
```

### 3.5. Xác minh Frontend đã chạy thành công

Terminal sẽ hiển thị:
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**Mở trình duyệt** và truy cập: **http://localhost:5173**

Bạn sẽ thấy trang đăng nhập của hệ thống.

### 3.6. Build cho Production (tùy chọn)

Nếu cần build bản production để deploy:

```bash
npm run build
```

File build sẽ được xuất ra thư mục `frontend/dist/`. Có thể preview bằng:

```bash
npm run preview
```

### 3.7. Thông tin kết nối Frontend

| Thuộc tính                     | Giá trị                                   |
|-------------------------------|------------------------------------------|
| **Dev Server URL**             | `http://localhost:5173`                   |
| **Preview Server URL**         | `http://localhost:4173` (sau `npm run preview`) |
| **Build Output**               | `frontend/dist/`                          |
| **API Target (Proxy)**         | `http://localhost:8080`                   |

> ✅ **Toàn bộ hệ thống đã sẵn sàng!** Đăng nhập bằng tài khoản mặc định ở phần dưới.

---

## 🔧 4. Cấu hình Biến Môi trường

### 4.1. File `.env` (thư mục gốc)

File `.env` ở thư mục gốc chứa thông tin kết nối Database:

```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=stdmanager_db
DB_USERNAME=sa
DB_PASSWORD=UniItAdmin2026
SERVER_PORT=8080
```

### 4.2. File `application.yaml` (Backend)

Cấu hình chính của Spring Boot tại `stdmanager/src/main/resources/application.yaml`:

| Key                                  | Mô tả                                           | Giá trị mặc định                          |
|--------------------------------------|--------------------------------------------------|--------------------------------------------|
| `server.port`                        | Cổng HTTP của Backend                            | `8080`                                     |
| `spring.datasource.url`             | JDBC URL kết nối SQL Server                      | `jdbc:sqlserver://localhost:1433;...`       |
| `spring.datasource.username`        | Tài khoản SQL Server                             | `sa`                                       |
| `spring.datasource.password`        | Mật khẩu SQL Server                              | `UniItAdmin2026`                           |
| `spring.jpa.hibernate.ddl-auto`     | Chiến lược tạo schema                           | `update`                                   |
| `spring.jpa.show-sql`               | Hiển thị SQL trong log                           | `true`                                     |
| `spring.flyway.enabled`             | Bật/tắt Flyway Migration                         | `true`                                     |
| `spring.flyway.baseline-on-migrate` | Tự động baseline nếu DB đã có dữ liệu           | `true`                                     |
| `app.cors.allowed-origins`          | Danh sách domain Frontend được phép gọi API      | `http://localhost:5173,http://localhost:5174` |

### 4.3. Tùy chỉnh cổng

**Đổi cổng Backend (mặc định 8080):**
- Sửa `SERVER_PORT` trong file `.env`, hoặc
- Sửa trực tiếp `server.port` trong `application.yaml`

**Đổi cổng Frontend (mặc định 5173):**
- Sửa file `frontend/vite.config.js`, thêm:
  ```js
  export default defineConfig({
    server: {
      port: 3000  // Đổi sang cổng mong muốn
    }
  })
  ```
- **Nhớ cập nhật** `app.cors.allowed-origins` trong `application.yaml` để Backend chấp nhận origin mới.

---

## 🗃️ 5. Flyway Migration — Quản lý Schema Tự động

Flyway tự động thực thi các file SQL theo thứ tự phiên bản khi Backend khởi động. Toàn bộ script nằm tại:

```
stdmanager/src/main/resources/db/migration/
```

### 5.1. Danh sách Migration (V1 → V23)

| Version | File                                                  | Mô tả                                                         |
|---------|-------------------------------------------------------|----------------------------------------------------------------|
| **V1**  | `V1__Init_Auth_Group_I.sql`                           | Tạo bảng `roles`, `users`, `user_roles`, `permissions`, `role_permissions` |
| **V2**  | `V2__Init_Lecturer_Group_III.sql`                     | Tạo bảng Giảng viên, Khoa, Bộ môn                              |
| **V3**  | `V3__Init_Student_Group_II.sql`                       | Tạo bảng Sinh viên, liên kết với User                          |
| **V4**  | `V4__Init_Course_Group_IV.sql`                        | Tạo bảng Chương trình đào tạo, Học phần, Điều kiện tiên quyết  |
| **V5**  | `V5__Init_Semester_Group_V.sql`                       | Tạo bảng Học kỳ, Niên khóa, Lớp học phần                      |
| **V6**  | `V6__Init_Registration_Group_VI.sql`                  | Tạo bảng Đợt đăng ký, Đăng ký tín chỉ                        |
| **V7**  | `V7__Init_Schedule_Group_VII.sql`                     | Tạo bảng Thời khóa biểu, Lịch học                             |
| **V8**  | `V8__Init_Grade_Group_VIII.sql`                       | Tạo bảng Điểm số, Thành phần điểm                             |
| **V9**  | `V9__Init_Tuition_Group_IX.sql`                       | Tạo bảng Học phí, Biểu phí, Hóa đơn                           |
| **V10** | `V10__Init_Exam_Group_X.sql`                          | Tạo bảng Khảo thí, Lịch thi, Phòng thi                        |
| **V11** | `V11__Init_Graduation_Group_XI.sql`                   | Tạo bảng Tốt nghiệp, Chứng chỉ, Văn bằng                     |
| **V12** | `V12__Init_Notification_Group_XII.sql`                | Tạo bảng Thông báo nội bộ                                      |
| **V13** | `V13__Init_Email_Group_XIV.sql`                       | Tạo bảng Email tự động, Template                               |
| **V14** | `V14__Fix_Database_Constraints_And_Performance.sql`   | Bổ sung ràng buộc, index, tối ưu hiệu suất                    |
| **V15** | `V15__Insert_Auth_Group_I.sql`                        | Seed dữ liệu: Roles, Permissions, Users mặc định              |
| **V16** | `V16__Insert_Lecturer_Group_III.sql`                  | Seed dữ liệu: Giảng viên mẫu                                   |
| **V17** | `V17__Insert_Course_Group_IV.sql`                     | Seed dữ liệu: Danh mục Học phần                                |
| **V18** | `V18__Insert_Student_Group_II.sql`                    | Seed dữ liệu: Sinh viên mẫu                                    |
| **V19** | `V19__Add_Missing_Columns_Group_VI.sql`               | Bổ sung cột thiếu cho module Đăng ký                           |
| **V20** | `V20__Insert_Semester_Group_V.sql`                    | Seed dữ liệu: Học kỳ, Lớp học phần                             |
| **V21** | `V21__Insert_Tuition_Sample_Data.sql`                 | Seed dữ liệu: Học phí mẫu                                      |
| **V22** | `V22__Create_System_Config.sql`                       | Tạo bảng Cấu hình hệ thống                                     |
| **V23** | `V23__Insert_More_Tuition_Debt_Sample.sql`            | Seed thêm dữ liệu công nợ cho test                             |

### 5.2. Lưu ý về Flyway

- **Không chỉnh sửa** file migration đã chạy. Flyway lưu checksum và sẽ báo lỗi nếu nội dung thay đổi.
- Nếu cần sửa schema, tạo file migration **mới** với version tiếp theo (VD: `V24__...`).
- Để reset toàn bộ database: xóa container Docker (`docker compose down -v`) và chạy lại từ đầu.

---

## 🔑 6. Tài khoản Đăng nhập Mặc định

Sau khi Flyway chạy xong (lần khởi động Backend đầu tiên), hệ thống sẽ có sẵn các tài khoản sau:

### 6.1. Tài khoản Quản trị

| Vai trò            | Username   | Password      | Email                       | Mô tả                                    |
|--------------------|------------|---------------|-----------------------------|-------------------------------------------|
| **Admin**          | `admin`    | `Admin@123`   | `admin@stdmanager.edu.vn`   | Toàn quyền quản trị hệ thống             |
| **Giáo vụ**       | `giaovu`   | `Admin@123`   | `giaovu@stdmanager.edu.vn`  | Quản lý đào tạo, đăng ký, điểm, học phí  |

### 6.2. Tài khoản Giảng viên & Sinh viên

Các tài khoản giảng viên và sinh viên được tạo tự động thông qua migration `V16` và `V18`. Mật khẩu mặc định cho tất cả tài khoản là `Admin@123` (BCrypt hash).

> **💡 Mẹo:** Để xem danh sách đầy đủ tài khoản, kiểm tra file:
> - `V15__Insert_Auth_Group_I.sql` — Tài khoản Admin & Giáo vụ
> - `V16__Insert_Lecturer_Group_III.sql` — Tài khoản Giảng viên
> - `V18__Insert_Student_Group_II.sql` — Tài khoản Sinh viên

---

## 🛡️ 7. Ma trận Phân quyền (RBAC)

Hệ thống triển khai mô hình **Role-Based Access Control** với 4 vai trò chính và các quyền chi tiết theo module:

### 7.1. Tổng quan Vai trò

| Vai trò        | Code         | Mô tả                                                    | Loại                |
|----------------|--------------|-----------------------------------------------------------|---------------------|
| Admin          | `ADMIN`      | Toàn quyền quản trị, cấu hình hệ thống, phân quyền      | Hệ thống (không xóa)|
| Giáo vụ       | `GIAOVU`     | Quản lý đào tạo, đăng ký tín chỉ, khảo thí              | Hệ thống            |
| Giảng viên    | `GIANGVIEN`  | Quản lý lớp học phần, nhập điểm                          | Hệ thống            |
| Sinh viên     | `SINHVIEN`   | Đăng ký tín chỉ, tra cứu điểm, xem học phí              | Hệ thống            |

### 7.2. Ma trận Quyền Chi tiết

| Module / Quyền               | ADMIN | GIAOVU | GIANGVIEN | SINHVIEN |
|-------------------------------|:-----:|:------:|:---------:|:--------:|
| `USER_CREATE`                 |  ✅   |   ❌   |    ❌     |    ❌    |
| `USER_READ`                   |  ✅   |   ❌   |    ❌     |    ❌    |
| `USER_UPDATE`                 |  ✅   |   ❌   |    ❌     |    ❌    |
| `USER_DELETE`                 |  ✅   |   ❌   |    ❌     |    ❌    |
| `STUDENT_CREATE`              |  ✅   |   ✅   |    ❌     |    ❌    |
| `STUDENT_READ`                |  ✅   |   ✅   |    ❌     |    ❌    |
| `COURSE_MANAGE`               |  ✅   |   ✅   |    ❌     |    ❌    |
| `COURSE_READ`                 |  ✅   |   ✅   |    ✅     |    ✅    |
| `REGISTRATION_MANAGE`         |  ✅   |   ✅   |    ❌     |    ❌    |
| `REGISTRATION_REGISTER`       |  ✅   |   ✅   |    ❌     |    ✅    |
| `GRADE_INPUT`                 |  ✅   |   ✅   |    ✅     |    ❌    |
| `GRADE_READ`                  |  ✅   |   ✅   |    ✅     |    ✅    |
| `FINANCE_MANAGE`              |  ✅   |   ✅   |    ❌     |    ❌    |
| `FINANCE_READ`                |  ✅   |   ✅   |    ❌     |    ✅    |

### 7.3. Phân quyền trên Frontend

Frontend sử dụng **Dynamic Sidebar** và **Route Guarding** để kiểm soát truy cập:

- **Sidebar:** Các mục menu tự động ẩn/hiện dựa trên vai trò người dùng từ JWT Token.
- **ProtectedRoute:** Component wrapper kiểm tra trạng thái đăng nhập. Nếu chưa đăng nhập → redirect về `/login`.
- **PublicRoute:** Ngược lại, nếu đã đăng nhập mà truy cập trang Login → redirect về Dashboard.

---

## 📡 8. Swagger API Documentation

Sau khi Backend chạy, truy cập tài liệu API tương tác tại:

| Tài nguyên        | URL                                        |
|-------------------|--------------------------------------------|
| **Swagger UI**     | http://localhost:8080/swagger-ui.html       |
| **OpenAPI JSON**   | http://localhost:8080/v3/api-docs           |

### 8.1. Các nhóm API chính

| Nhóm API               | Base Path                     | Mô tả                                          |
|------------------------|-------------------------------|-------------------------------------------------|
| Authentication         | `/api/v1/auth/...`            | Login, kiểm tra Token (`/me`)                   |
| User Management        | `/api/v1/users/...`           | CRUD tài khoản người dùng                       |
| Student Management     | `/api/v1/students/...`        | CRUD hồ sơ sinh viên                            |
| Lecturer Management    | `/api/v1/lecturers/...`       | CRUD hồ sơ giảng viên                           |
| Course Management      | `/api/v1/courses/...`         | Quản lý học phần, chương trình đào tạo          |
| Semester Management    | `/api/v1/semesters/...`       | Quản lý học kỳ, lớp học phần                    |
| Registration           | `/api/v1/registrations/...`   | Đăng ký tín chỉ                                |
| Tuition & Finance      | `/api/v1/tuitions/...`        | Học phí, công nợ, thanh toán                    |
| Notifications          | `/api/v1/notifications/...`   | Thông báo nội bộ                                |
| System Config          | `/api/v1/system-config/...`   | Cấu hình hệ thống                              |

### 8.2. Sử dụng Swagger để test API

1. Truy cập **Swagger UI** tại http://localhost:8080/swagger-ui.html
2. Gọi endpoint `POST /api/v1/auth/login` với body:
   ```json
   {
     "username": "admin",
     "password": "Admin@123"
   }
   ```
3. Copy JWT Token từ response.
4. Nhấn nút **"Authorize"** (🔒) ở góc trên bên phải.
5. Nhập: `Bearer <token_vừa_copy>` → Nhấn **Authorize**.
6. Giờ bạn có thể test tất cả API với quyền Admin.

---

## 🛠️ 9. Xử lý Sự cố & Lỗi Thường gặp

### 9.1. Lỗi kết nối Database

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Connection refused` khi Backend khởi động | Docker container chưa chạy hoặc chưa sẵn sàng | Kiểm tra `docker ps`, đợi 15-30s sau khi container `Up` |
| `Cannot open database "stdmanager_db"` | Chưa tạo database ở Bước 1.5 | Chạy lại lệnh tạo database ở Bước 1.5 |
| `Login failed for user 'sa'` | Sai mật khẩu SQL Server | Kiểm tra `DB_PASSWORD` trong `.env` khớp với `MSSQL_SA_PASSWORD` trong `docker-compose.yml` |
| `The TCP/IP connection... has failed` | Docker không map port 1433 | Kiểm tra `docker ps`, cột PORTS phải hiện `0.0.0.0:1433->1433/tcp` |

### 9.2. Lỗi Backend (Spring Boot)

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Port 8080 already in use` | Cổng 8080 bị ứng dụng khác chiếm | Đổi `SERVER_PORT` trong `.env` hoặc tắt ứng dụng đang dùng cổng 8080 |
| `Flyway migration checksum mismatch` | File migration đã chạy bị chỉnh sửa | Xóa database & volume Docker, chạy lại từ đầu: `docker compose down -v` |
| `java.lang.UnsupportedClassVersionError` | Đang dùng Java < 21 | Cài đặt JDK 21 và đặt `JAVA_HOME` trỏ đúng phiên bản |
| `NoSuchMethodError` hoặc lỗi dependency | Xung đột phiên bản thư viện | Chạy `mvn clean` rồi `mvn spring-boot:run` lại |
| `Circular Dependency` | Lỗi vòng lặp bean injection | Kiểm tra `@Lazy` annotation trong `SecurityConfig` |

### 9.3. Lỗi Frontend (React + Vite)

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `npm install` thất bại | Node.js version không tương thích | Cài Node.js 18 LTS hoặc 20 LTS |
| CORS error trong Console | Backend chưa chạy hoặc origin không được phép | Đảm bảo Backend đang chạy và `allowed-origins` trong `application.yaml` chứa URL Frontend |
| Trang trắng sau khi login | JWT Token không hợp lệ hoặc hết hạn | Xóa `localStorage` trong DevTools → thử lại |
| `404 Not Found` khi gọi API | Sai đường dẫn API hoặc Backend chưa sẵn sàng | Kiểm tra Swagger UI để xác nhận endpoint tồn tại |
| `ERR_CONNECTION_REFUSED` | Backend (port 8080) chưa chạy | Khởi động Backend trước khi dùng Frontend |

### 9.4. Reset toàn bộ hệ thống về trạng thái ban đầu

Nếu gặp lỗi không thể khắc phục hoặc muốn bắt đầu lại từ đầu:

```bash
# 1. Tắt Frontend (Ctrl+C trong terminal Frontend)

# 2. Tắt Backend (Ctrl+C trong terminal Backend)

# 3. Xóa Docker container và volume
cd docker
docker compose down -v

# 4. Xóa build cache của Backend
cd ../stdmanager
mvn clean

# 5. Xóa node_modules của Frontend (tùy chọn)
cd ../frontend
rm -rf node_modules
npm install

# 6. Chạy lại từ Bước 1
```

---

## 📚 10. Phụ lục — Công nghệ & Tài liệu Tham khảo

### 10.1. Tech Stack tổng hợp

#### Backend
| Công nghệ                     | Phiên bản   | Mục đích                                    |
|-------------------------------|-------------|---------------------------------------------|
| Spring Boot                   | 4.0.6       | Application framework                       |
| Spring Security               | 6.x         | Authentication & Authorization (JWT + RBAC) |
| Spring Data JPA               | 3.x         | ORM / Database access                       |
| Hibernate                     | 6.x         | JPA implementation                          |
| Flyway                        | 10.x        | Database migration management               |
| SpringDoc OpenAPI             | 3.0.0-RC1   | Swagger UI / API documentation              |
| JJWT                          | 0.12.6      | JWT Token generation & validation           |
| Lombok                        | Latest      | Boilerplate code reduction                  |
| SQL Server JDBC               | Runtime     | Database driver                             |
| Java                          | 21          | Runtime platform                            |
| Maven                         | 3.9+        | Build tool & dependency management          |

#### Frontend
| Công nghệ                     | Phiên bản   | Mục đích                                    |
|-------------------------------|-------------|---------------------------------------------|
| React                         | 19.2.5      | UI component library                        |
| Vite                          | 8.0.10      | Build tool & dev server                     |
| TailwindCSS                   | 4.2.4       | Utility-first CSS framework                 |
| Zustand                       | 5.0.12      | Lightweight state management                |
| Axios                         | 1.15.2      | HTTP client (API calls)                     |
| React Router DOM              | 7.14.2      | Client-side routing                         |
| React Hook Form               | 7.73.1      | Form validation & management                |
| React Hot Toast               | 2.6.0       | Toast notifications                         |
| Lucide React                  | 1.11.0      | Icon library                                |
| QRCode.react                  | 4.2.0       | QR Code generation                          |

#### Infrastructure
| Công nghệ                     | Phiên bản   | Mục đích                                    |
|-------------------------------|-------------|---------------------------------------------|
| Docker                        | Latest      | Containerization                            |
| Docker Compose                | v2          | Multi-container orchestration               |
| SQL Server                    | 2022        | Relational database                         |

### 10.2. Tài liệu Tham khảo

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Flyway Documentation](https://documentation.red-gate.com/fd)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [SQL Server Docker Hub](https://hub.docker.com/_/microsoft-mssql-server)

---

> 📝 **Cập nhật lần cuối:** Tháng 5, 2026
> 
> Nếu gặp vấn đề không có trong tài liệu này, hãy kiểm tra file `README.md` để xem tổng quan các tính năng nghiệp vụ của hệ thống.
