# 🎓 University IT Management System — stdmanager

<div align="center">

**Hệ thống Quản lý Đào tạo Đại học toàn diện**

Nền tảng quản lý thông tin đại học hiện đại, được xây dựng với Spring Boot 4 + React 19,
phục vụ toàn bộ quy trình đào tạo từ tuyển sinh, đăng ký tín chỉ, quản lý điểm đến cấp phát văn bằng.

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=for-the-badge&logo=microsoft-sql-server)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

---

## 📑 Mục lục

- [Giới thiệu Dự án](#-giới-thiệu-dự-án)
- [Tính năng Nổi bật](#-tính-năng-nổi-bật)
- [Kiến trúc Hệ thống](#-kiến-trúc-hệ-thống)
- [Phần 1: Lộ trình Phát triển](#️-phần-1-lộ-trình-phát-triển-development-phases)
- [Phần 2: Chi tiết Module Nghiệp vụ](#-phần-2-chi-tiết-các-module-nghiệp-vụ)
- [Phần 3: Cơ sở Dữ liệu — 13 Nhóm Bảng](#️-phần-3-cơ-sở-dữ-liệu--13-nhóm-bảng)
- [Phần 4: Tech Stack Chi tiết](#-phần-4-tech-stack-chi-tiết)
- [Phần 5: Giao diện Người dùng](#-phần-5-giao-diện-người-dùng)
- [Phần 6: Bảo mật & Phân quyền](#️-phần-6-bảo-mật--phân-quyền-chi-tiết)
- [Phần 7: API Endpoints](#-phần-7-api-endpoints)
- [Hướng dẫn Cài đặt Nhanh](#-hướng-dẫn-cài-đặt-nhanh)
- [Đóng góp & Liên hệ](#-đóng-góp--liên-hệ)

---

## 📖 Giới thiệu Dự án

**stdmanager** là hệ thống quản lý đào tạo đại học toàn diện (**University Training Management System**), được thiết kế và xây dựng để số hóa toàn bộ quy trình vận hành của một trường đại học. Hệ thống giải quyết các bài toán nghiệp vụ phức tạp từ quản lý hồ sơ sinh viên, tổ chức chương trình đào tạo, đăng ký tín chỉ, quản lý điểm số, tài chính học phí cho đến khảo thí và cấp phát văn bằng tốt nghiệp.

### Vấn đề giải quyết

Trong thực tế, nhiều trường đại học vẫn đang sử dụng các phương pháp quản lý truyền thống hoặc các hệ thống rời rạc, dẫn đến:

| ❌ Vấn đề hiện tại | ✅ Giải pháp stdmanager |
|---|---|
| Dữ liệu sinh viên phân tán, khó tổng hợp | Cơ sở dữ liệu tập trung với 13 nhóm bảng liên kết chặt chẽ |
| Đăng ký tín chỉ thủ công, dễ sai sót | Module đăng ký trực tuyến với kiểm tra điều kiện tự động |
| Nhập điểm bằng Excel, thiếu kiểm soát | Hệ thống nhập điểm với phân quyền và truy vết thay đổi |
| Theo dõi học phí thủ công, thiếu minh bạch | Module tài chính tự động tính toán và theo dõi công nợ |
| Không có phân quyền rõ ràng | RBAC 4 vai trò + 14 quyền chi tiết theo module |
| Thiếu thông báo kịp thời | Hệ thống thông báo nội bộ + Email tự động theo sự kiện |

### Đối tượng sử dụng

Hệ thống phục vụ **4 nhóm người dùng** chính trong môi trường đại học:

```
👤 ADMIN (Quản trị viên)         → Toàn quyền quản trị, cấu hình hệ thống
👤 GIAOVU (Nhân viên Giáo vụ)    → Quản lý đào tạo, đăng ký, điểm, tài chính
👤 GIANGVIEN (Giảng viên)        → Quản lý lớp học phần, nhập điểm, xem lịch dạy
👤 SINHVIEN (Sinh viên)          → Đăng ký tín chỉ, xem điểm, tra cứu học phí
```

---

## ✨ Tính năng Nổi bật

### 🔐 Bảo mật Cấp Doanh nghiệp
- Xác thực JWT Stateless — không lưu session trên server
- Phân quyền RBAC đa cấp (Role → Permission → Module)
- Mật khẩu được mã hóa bằng BCrypt (12 rounds)
- Kiểm tra quyền hạn mức phương thức với `@PreAuthorize`
- CORS configuration chống Cross-Origin attacks

### 📊 Dashboard Thông minh Theo Vai trò
- Mỗi vai trò có Dashboard riêng biệt với widget phù hợp
- Admin: Tổng quan hệ thống, quản trị tài khoản, cấu hình
- Giáo vụ: Quản lý đào tạo, học phần, đăng ký, điểm số
- Giảng viên: Lịch dạy, danh sách lớp, nhập điểm
- Sinh viên: Lịch học, tra cứu điểm, công nợ học phí

### 🗄️ Cơ sở Dữ liệu Quy mô Lớn
- 13 nhóm bảng, 23 phiên bản migration (V1 → V23)
- Schema được thiết kế theo chuẩn 3NF
- Toàn bộ khóa chính sử dụng UUID (UNIQUEIDENTIFIER)
- Soft delete pattern — dữ liệu không bao giờ bị xóa vĩnh viễn
- Audit trail tự động (created_at, updated_at, created_by, updated_by)

### ⚡ Hiệu suất & Trải nghiệm
- Single Page Application (SPA) — chuyển trang không tải lại
- Axios Interceptor tự động xử lý JWT & lỗi 401/403
- Zustand state management với localStorage persistence
- Dynamic Sidebar tự động hiển thị menu theo vai trò
- TailwindCSS 4 cho giao diện hiện đại, responsive

### 🔄 Database Migration Tự động
- Flyway quản lý 23 phiên bản schema
- Seed data tự động: tài khoản, vai trò, quyền hạn, dữ liệu mẫu
- Rollback an toàn, không xung đột giữa các môi trường

---

## 🏛️ Kiến trúc Hệ thống

### Tổng quan Kiến trúc 3-Tier

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         🌐 PRESENTATION TIER                           │
│                                                                         │
│   React 19 + Vite 8 + TailwindCSS 4 + Zustand + React Router 7        │
│                                                                         │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│   │  Login   │ │Dashboard │ │ Students │ │ Finance  │ │ Academic │    │
│   │  Page    │ │   Page   │ │   Page   │ │   Page   │ │   Page   │    │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │  Axios Client + JWT Interceptor + useAuthStore (Zustand)    │      │
│   └─────────────────────────────┬───────────────────────────────┘      │
│                     http://localhost:5173                                │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │  REST API (JSON)
                                  │  Authorization: Bearer <JWT Token>
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ⚙️ APPLICATION TIER                             │
│                                                                         │
│   Spring Boot 4.0.6 + Spring Security 6 + Spring Data JPA             │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │              Security Filter Chain                          │      │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐          │      │
│   │  │JWT Filter│→ │RBAC Check│→ │ @PreAuthorize    │          │      │
│   │  └──────────┘  └──────────┘  └──────────────────┘          │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│   │Controller│→│ Service  │→│Repository│→│  Entity  │                 │
│   │  (API)   │ │ (Logic)  │ │  (JPA)   │ │(Hibernate│                 │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘                 │
│                                                                         │
│   Modules: Auth │ Student │ Lecturer │ Course │ Semester │             │
│            Registration │ Tuition │ Notification │ SystemConfig       │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │  Flyway Migration (V1 → V23) + Swagger OpenAPI 3           │      │
│   └─────────────────────────────┬───────────────────────────────┘      │
│                     http://localhost:8080                                │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │  JDBC / JPA (Hibernate 6)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          💾 DATA TIER                                   │
│                                                                         │
│   Microsoft SQL Server 2022 (Docker Container)                         │
│   Container: uni_it_sqlserver │ Port: 1433                             │
│   Database: stdmanager_db                                              │
│                                                                         │
│   13 nhóm bảng │ 23+ bảng dữ liệu │ UUID Primary Keys                │
│   Soft Delete │ Audit Trail │ FK Constraints │ Indexes                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Luồng Xử lý Request Chi tiết

```
[Browser] → HTTP Request + JWT Token
     │
     ▼
[CORS Filter] → Kiểm tra origin (localhost:5173)
     │
     ▼
[JWT Authentication Filter] → Giải mã Token → Lấy UserDetails
     │
     ▼
[Authorization Check] → @PreAuthorize("hasRole('ADMIN')") 
     │
     ▼
[Controller] → Nhận request, validate DTO
     │
     ▼
[Service Layer] → Xử lý logic nghiệp vụ
     │
     ▼
[Repository (JPA)] → Truy vấn / cập nhật Database
     │
     ▼
[Entity → DTO Mapping] → Chuyển đổi dữ liệu
     │
     ▼
[ApiResponse<T>] → Chuẩn hóa response JSON
     │
     ▼
[Browser] ← HTTP Response (JSON)
```

### Kiến trúc Module Backend (Layered Architecture)

```
uni.it.stdmanager/
├── core/                              ← Hạ tầng dùng chung (cross-cutting)
│   ├── config/                        ← Cấu hình ứng dụng
│   │   ├── SecurityConfig.java        ← Spring Security filter chain
│   │   ├── CorsConfig.java            ← CORS policy
│   │   └── JpaAuditingConfig.java     ← Auto audit (createdBy, updatedBy)
│   ├── dto/                           ← Data Transfer Objects
│   │   └── ApiResponse<T>.java        ← Response wrapper chuẩn hóa
│   ├── entity/                        ← Base entities
│   │   └── BaseEntity.java            ← Audit fields (created_at, updated_at, ...)
│   ├── exception/                     ← Xử lý lỗi tập trung
│   │   └── GlobalExceptionHandler.java
│   └── security/                      ← JWT & Authentication
│       ├── JwtProvider.java           ← Generate / Validate Token
│       └── JwtAuthenticationFilter.java
│
└── modules/                           ← 9 Module nghiệp vụ
    ├── i_auth/                        ← Xác thực & Phân quyền
    ├── ii_student/                    ← Quản lý Sinh viên
    ├── iii_lecturer/                  ← Quản lý Giảng viên & Nhân sự
    ├── iv_course/                     ← Chương trình Đào tạo & Học phần
    ├── v_semester/                    ← Học kỳ & Lớp học phần
    ├── vi_registration/               ← Đăng ký Tín chỉ
    ├── vii_tuition/                   ← Tài chính & Học phí
    ├── xii_notification/              ← Thông báo nội bộ
    └── xiii_system_config/            ← Cấu hình hệ thống
```

Mỗi module được tổ chức theo cấu trúc chuẩn:
```
module_name/
├── controller/       ← REST API endpoints
├── service/          ← Business logic (Interface + Implementation)
├── repository/       ← JPA Repository (extends JpaRepository)
├── entity/           ← Database entity (JPA @Entity)
└── dto/
    ├── request/      ← Request DTO (validation)
    └── response/     ← Response DTO (data transfer)
```

---

## 🏗️ Phần 1: Lộ trình Phát triển (Development Phases)

Dưới đây là lộ trình xây dựng hệ thống từ nền tảng kỹ thuật đến trải nghiệm người dùng cuối, qua **5 giai đoạn** chính.

### 🏗️ Giai đoạn 1: Thiết lập Hạ tầng & Cơ sở Dữ liệu (Infrastructure)
*Bước đặt nền móng, đảm bảo dữ liệu có nơi trú ngụ an toàn và quy trình quản lý chuyên nghiệp.*

*   **Docker hóa Database:** Triển khai Microsoft SQL Server 2022 trên Docker với `docker-compose.yml`, cho phép toàn đội ngũ phát triển chạy cùng một môi trường database thống nhất mà không cần cài đặt SQL Server trực tiếp trên máy.
*   **Thiết kế Schema 13 nhóm bảng:** Quy hoạch toàn bộ cấu trúc dữ liệu theo nguyên tắc chuẩn hóa 3NF, bao trùm từ xác thực (Auth), sinh viên, giảng viên, học phần, học kỳ, đăng ký, thời khóa biểu, điểm số, học phí, khảo thí, tốt nghiệp, thông báo đến email.
*   **Flyway Migration (V1 → V23):** Áp dụng Flyway để quản lý phiên bản cơ sở dữ liệu một cách tự động. Mỗi thay đổi schema được ghi nhận bằng file SQL có đánh số phiên bản, đảm bảo:
    - Mọi developer đều có database giống nhau
    - Lịch sử thay đổi schema được lưu trữ rõ ràng
    - Rollback và nâng cấp database không gây xung đột
*   **Seed Data Tự động:** Migration từ V15 → V23 chứa dữ liệu mẫu (tài khoản, vai trò, quyền hạn, giảng viên, sinh viên, học phần, học phí,...) để hệ thống sẵn sàng sử dụng ngay sau khi khởi động.

### ⚙️ Giai đoạn 2: Xây dựng "Xương sống" Backend (Core Engine)
*Thiết lập bộ khung logic cho Spring Boot 4 để xử lý các yêu cầu nghiệp vụ phức tạp.*

*   **Layered Architecture:** Phân chia rõ ràng theo 4 lớp — Controller (tiếp nhận request) → Service (xử lý logic) → Repository (truy vấn DB) → Entity (ánh xạ bảng). Giúp code dễ bảo trì, mở rộng và test.
*   **BaseEntity:** Entity gốc chứa các trường audit tự động: `id` (UUID), `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`, `is_active`. Tất cả entity khác đều kế thừa.
*   **ApiResponse\<T\>:** DTO wrapper chuẩn hóa toàn bộ response trả về Frontend, đảm bảo format nhất quán:
    ```json
    {
      "success": true,
      "message": "Lấy danh sách sinh viên thành công",
      "data": { ... },
      "timestamp": "2026-05-31T23:00:00"
    }
    ```
*   **Global Exception Handling:** Bộ bắt lỗi tập trung (`@ControllerAdvice`) xử lý tất cả exception, đảm bảo hệ thống không bao giờ trả về stack trace hay lỗi thô cho client. Các loại lỗi được phân loại: Validation Error (400), Unauthorized (401), Forbidden (403), Not Found (404), Internal Server Error (500).
*   **JPA Auditing:** Kết hợp `@EnableJpaAuditing` và `@CreatedBy`, `@LastModifiedBy` để tự động ghi nhận danh tính người thực hiện thao tác tạo/cập nhật dữ liệu, phục vụ kiểm toán.

### 🛡️ Giai đoạn 3: Bảo mật & Xác thực (Security & Identity)
*Xây dựng "tường lửa" nhiều lớp để bảo vệ dữ liệu nhạy cảm của nhà trường.*

*   **Spring Security 6 & JWT:** Triển khai xác thực không trạng thái (Stateless Authentication) bằng JSON Web Token. Quy trình: User đăng nhập → Server trả JWT → Client gửi JWT trong Header mọi request → Server xác thực Token mỗi lần.
*   **RBAC (Role-Based Access Control):** Mô hình phân quyền 3 cấp: **User → Role → Permission**. Mỗi user có 1+ role, mỗi role có 1+ permission. Hệ thống quản lý 4 vai trò hệ thống (Admin, Giáo vụ, Giảng viên, Sinh viên) với 14 quyền chi tiết chia theo module (USER, STUDENT, COURSE, REGISTRATION, GRADE, FINANCE).
*   **Bảo vệ Endpoint:** Kết hợp `SecurityFilterChain` (cấp toàn cục) và `@PreAuthorize` (cấp phương thức) để kiểm soát quyền truy cập chính xác đến từng API endpoint.
*   **Mã hóa Mật khẩu:** Sử dụng BCrypt với 12 rounds salt, đảm bảo mật khẩu không bao giờ lưu dưới dạng plain text.
*   **Xử lý lỗi hạ tầng:** Giải quyết các vấn đề phức tạp phát sinh trong quá trình tích hợp Security: Circular Dependency giữa SecurityConfig và UserService, xung đột phiên bản thư viện (NoSuchMethodError), cấu hình JWT secret key an toàn.

### 🔌 Giai đoạn 4: Cổng Giao tiếp & Tài liệu hóa (API Documentation)
*Tạo ra "bản hợp đồng" rõ ràng để Frontend và Backend hiểu nhau.*

*   **OpenAPI 3 + Swagger UI:** Tích hợp SpringDoc OpenAPI 3.0 để tự động sinh tài liệu API tương tác. Truy cập `/swagger-ui.html` để xem danh sách endpoints, thử gọi API trực tiếp, xem request/response schema.
*   **CORS Configuration:** Cấu hình Cross-Origin Resource Sharing cho phép Frontend (localhost:5173) gọi API đến Backend (localhost:8080) an toàn. Hỗ trợ nhiều origin thông qua biến môi trường `ALLOWED_ORIGINS`.
*   **DTO Pattern:** Tách biệt hoàn toàn Entity (database) và DTO (API). Request DTO có validation annotation (`@NotBlank`, `@Email`, `@Size`), Response DTO chỉ chứa thông tin cần thiết — tăng bảo mật và giảm băng thông.

### 🎨 Giai đoạn 5: Frontend Connectivity & Dynamic UI (Giao diện động)
*Biến các API thành trải nghiệm người dùng trực quan, mượt mà.*

*   **Zustand State Management:** Quản lý trạng thái toàn cục với `useAuthStore` (lưu JWT Token, thông tin user, trạng thái đăng nhập) và `useRegistrationStore` (quản lý quy trình đăng ký tín chỉ). Hỗ trợ persistence qua localStorage — không mất session khi F5.
*   **Axios Interceptor:** Tự động đính kèm JWT Token vào Header `Authorization` mọi request. Tự động xử lý lỗi 401 (token hết hạn → logout + redirect login) và 403 (không đủ quyền → thông báo).
*   **Route Guarding:**
    - `ProtectedRoute`: Bảo vệ tuyến đường nội bộ — yêu cầu đăng nhập mới truy cập được.
    - `PublicRoute`: Ngăn user đã đăng nhập quay lại trang Login — tự động redirect về Dashboard.
*   **MainLayout & Dynamic Sidebar:** Layout chính gồm Header (thông tin user, logout) + Sidebar (menu điều hướng) + Content Area. Sidebar tự động co giãn (collapse/expand), hiển thị menu dựa trên vai trò (role) được decode từ JWT Token.
*   **Responsive Design:** Giao diện tương thích đa thiết bị nhờ TailwindCSS utility-first classes và grid system responsive.

---

## 📦 Phần 2: Chi tiết Các Module Nghiệp vụ

Hệ thống được chia thành **6 nhóm chức năng chính**, mỗi nhóm chứa các module nghiệp vụ riêng biệt nhưng tương tác chặt chẽ với nhau thông qua Foreign Key và Service layer.

---

### 🔐 Nhóm I: Quản trị và Bảo mật (Auth Module)
*Đóng vai trò là "người gác cổng" — kiểm soát ai được vào, được làm gì, và ghi lại mọi hành động.*

#### 1. Xác thực người dùng (Authentication)
*   **Đăng nhập hệ thống:** Tiếp nhận thông tin định danh (Username/Password) qua `POST /api/v1/auth/login`. Hệ thống so khớp mật khẩu với BCrypt hash trong database, nếu hợp lệ → sinh JWT Token.
*   **Cấp phát JWT Token:** Token chứa các claims: `sub` (user ID), `username`, `roles` (danh sách vai trò), `iat` (thời gian phát hành), `exp` (thời gian hết hạn). Token được ký bằng HMAC-SHA256 với secret key cấu hình.
*   **Kiểm tra trạng thái xác thực:** Endpoint `GET /api/v1/auth/me` cho phép Frontend xác minh Token hiện tại còn hiệu lực và lấy thông tin user profile đầy đủ (họ tên, email, vai trò, quyền hạn).
*   **Đăng ký tài khoản mới:** Cho phép tạo tài khoản với validation đầy đủ (username unique, email format, password strength).
*   **Quên mật khẩu:** Quy trình khôi phục mật khẩu thông qua email xác thực.

#### 2. Quản lý phân quyền (Authorization — RBAC)
*   **Mô hình 3 cấp:** User → UserRole → Role → RolePermission → Permission. Cho phép một user có nhiều role, mỗi role có nhiều permission.
*   **4 Vai trò hệ thống:** ADMIN (toàn quyền), GIAOVU (quản lý đào tạo), GIANGVIEN (giảng dạy), SINHVIEN (học tập). Vai trò hệ thống được đánh dấu `is_system = 1` và không thể xóa.
*   **14 Permission chi tiết:** Chia theo 6 module: USER (4 quyền CRUD), STUDENT (2 quyền), COURSE (2 quyền), REGISTRATION (2 quyền), GRADE (2 quyền), FINANCE (2 quyền).
*   **Bảo vệ tài nguyên phía Server:** Kết hợp `SecurityFilterChain` (whitelist endpoint công khai) và `@PreAuthorize("hasRole('ADMIN')")` (kiểm tra quyền cấp method).
*   **Điều hướng động phía Client:** Frontend decode JWT Token để lấy danh sách role → tự động lọc menu Sidebar và ẩn/hiện tính năng phù hợp.

#### 3. Bảo mật hạ tầng và Giao tiếp
*   **CORS Policy:** Whitelist chỉ cho phép origin tin cậy (`http://localhost:5173`, `http://localhost:5174`) gửi request đến Backend. Có thể cấu hình thêm domain production qua biến môi trường.
*   **Stateless Security:** Không sử dụng server-side session — giảm tải server, hỗ trợ horizontal scaling. Mỗi request được xác thực độc lập qua JWT Token.
*   **Audit Trail:** JPA Auditing tự động ghi nhận `created_by` (ai tạo), `updated_by` (ai sửa), `created_at`, `updated_at` cho mọi thao tác trên database.

#### 4. Tích hợp Frontend (Auth Integration)
*   **useAuthStore (Zustand):** Store toàn cục lưu: `token`, `user` (profile + roles), `isAuthenticated`. Persist vào localStorage — duy trì đăng nhập khi reload/đóng mở tab.
*   **Axios Interceptor:** Tự động inject `Authorization: Bearer <token>` vào mọi request. Bắt response error 401 → auto logout + redirect `/login`. Error 403 → toast thông báo "Không đủ quyền".

---

### 👥 Nhóm II: Quản lý Người dùng (User Management Module)
*Tập hợp các chức năng cốt lõi để quản lý "thực thể" con người trong hệ thống — từ sinh viên, giảng viên đến nhân viên.*

#### 1. Module Sinh viên (Student Module)
*Quản lý toàn bộ vòng đời của một sinh viên tại trường — từ ngày nhập học đến khi tốt nghiệp.*

*   **Hồ sơ định danh toàn diện:** Lưu trữ chi tiết MSSV, họ tên, ngày sinh, giới tính, CCCD, ngày cấp, nơi cấp, địa chỉ thường trú, địa chỉ hiện tại, khoa, ngành, chương trình đào tạo, lớp hành chính, năm nhập học.
*   **Theo dõi trạng thái học tập:** Bảng `student_status` ghi lại lịch sử thay đổi trạng thái: Đang học → Bảo lưu → Quay lại học → Tốt nghiệp. Mỗi thay đổi ghi nhận ngày bắt đầu, ngày kết thúc, lý do, mô tả.
*   **Liên kết tài khoản User:** Mỗi sinh viên được gắn 1-1 với một `user` (FK `user_id`) để đăng nhập và xác thực quyền hạn.
*   **Lớp hành chính (Student Classes):** Quản lý lớp sinh hoạt (VD: CNTT-K20A) với mã lớp, tên lớp, khóa học, ngành, khoa, cố vấn học tập.
*   **Giao diện quản lý:**
    - `StudentListPage`: Danh sách sinh viên với tìm kiếm, phân trang, lọc theo trạng thái.
    - `StudentFormModal`: Form thêm/sửa sinh viên với validation đầy đủ.
    - `StudentDetailModal`: Xem chi tiết hồ sơ sinh viên.
    - `StudentStatusModal`: Cập nhật trạng thái học tập.
    - `ClassHierarchyPage`: Quản lý cấu trúc lớp hành chính.

#### 2. Module Giảng viên & Nhân viên (Lecturer/Staff Module)
*Quản lý đội ngũ nhân sự vận hành nhà trường — giảng viên, nhân viên giáo vụ, nhân viên hành chính.*

*   **Hồ sơ nhân sự:** Lưu trữ thông tin chuyên môn, học vị (Cử nhân, Thạc sĩ, Tiến sĩ, Phó Giáo sư, Giáo sư), chức vụ, bộ môn, khoa.
*   **Phân quyền nghiệp vụ:**
    - *Giảng viên:* Được gán role `GIANGVIEN` — quyền xem học phần (`COURSE_READ`), nhập điểm (`GRADE_INPUT`), xem điểm (`GRADE_READ`).
    - *Nhân viên Giáo vụ:* Được gán role `GIAOVU` — toàn quyền quản lý sinh viên, học phần, đăng ký, điểm, tài chính.
*   **Giao diện quản lý:** `LecturerManagementPage` — danh sách giảng viên với tìm kiếm, thêm/sửa/xóa, lọc theo khoa/bộ môn.

#### 3. Tính năng quản trị chung (Core User Features)
*   **CRUD Operations:** API đầy đủ để thêm (`POST`), xem (`GET`), cập nhật (`PUT`/`PATCH`), xóa mềm (`DELETE`) cho tất cả đối tượng người dùng.
*   **Audit Trail:** Mọi thao tác thay đổi đều ghi lại ai làm, lúc nào — phục vụ kiểm toán nội bộ.
*   **Tìm kiếm và Lọc:** Hỗ trợ tìm kiếm theo mã định danh, họ tên, trạng thái, khoa, ngành — kết quả phân trang.
*   **Soft Delete:** Xóa logic (đặt `is_active = 0`, ghi `deleted_at`, `deleted_by`) thay vì xóa vật lý — dữ liệu luôn có thể khôi phục.

---

### 🏫 Nhóm III: Học thuật và Đào tạo (Academic Module)
*Trung tâm vận hành các hoạt động giáo dục cốt lõi — từ xây dựng chương trình đến đánh giá kết quả học tập.*

#### 1. Quản lý Chương trình & Học phần
*   **Khung chương trình đào tạo:** Thiết lập cấu trúc chương trình đào tạo theo ngành, gồm danh sách học phần bắt buộc, tự chọn, và số tín chỉ tối thiểu để tốt nghiệp.
*   **Danh mục học phần:** Mỗi học phần có mã môn, tên môn, số tín chỉ (lý thuyết + thực hành), mô tả, điều kiện tiên quyết. Hỗ trợ sơ đồ cây môn học để sinh viên biết học môn nào trước.
*   **Thời gian biểu học thuật:** Định nghĩa niên khóa (VD: 2025-2026), học kỳ (HK1, HK2, Hè), ngày bắt đầu/kết thúc, và các cột mốc quan trọng (bắt đầu đăng ký, hạn chót, tuần thi).
*   **Giao diện quản lý:**
    - `CourseManagementPage`: Quản lý danh mục học phần, thêm/sửa/xóa môn học.
    - `AcademicManagementPage`: Quản lý chương trình đào tạo, cấu trúc học kỳ, lớp học phần.

#### 2. Đăng ký Học phần
*   **Đợt đăng ký trực tuyến:** Admin/Giáo vụ thiết lập khoảng thời gian đăng ký cho từng học kỳ. Sinh viên chỉ được đăng ký trong khung giờ mở.
*   **Xử lý đăng ký:** Tiếp nhận yêu cầu đăng ký môn học từ sinh viên, kiểm tra:
    - Điều kiện tiên quyết (đã hoàn thành môn prerequisite chưa?)
    - Trùng lịch học (có bị overlap thời gian không?)
    - Sĩ số lớp (lớp còn chỗ không?)
*   **Quản lý đăng ký:** Giáo vụ có thể phê duyệt/từ chối đăng ký, xem thống kê sĩ số theo lớp.

#### 3. Tổ chức Lịch học & Lịch dạy
*   **Thời khóa biểu:** Sắp xếp lịch học theo tuần, bao gồm: thứ/ngày, tiết học (1-12), phòng học, giảng viên phụ trách, hình thức (lý thuyết/thực hành).
*   **Lịch cá nhân hóa:**
    - *Sinh viên:* Dashboard hiển thị lịch học tuần hiện tại, các môn đã đăng ký, phòng học.
    - *Giảng viên:* Lịch giảng dạy chi tiết, danh sách lớp phụ trách, sĩ số từng lớp.

#### 4. Quản lý Điểm & Kết quả Học tập
*   **Quy trình nhập điểm:** Giảng viên nhập điểm thành phần (chuyên cần, giữa kỳ, cuối kỳ) cho từng sinh viên trong lớp mình phụ trách.
*   **Bảng điểm tổng hợp:** Tính toán điểm trung bình theo công thức trọng số, quy đổi thang điểm 10 → thang điểm 4 → thang chữ (A, B+, B, ...).
*   **Tra cứu kết quả:** Sinh viên xem bảng điểm cá nhân, GPA từng kỳ, GPA tích lũy, số tín chỉ đã hoàn thành.

---

### 💰 Nhóm IV: Tài chính (Finance Module)
*Quản lý dòng tiền liên quan đến nghĩa vụ học tập — đảm bảo tính minh bạch, chính xác và có thể kiểm toán.*

#### 1. Quản lý Định mức & Biểu phí
*   **Cấu hình học phí:** Định nghĩa đơn giá tín chỉ theo loại (lý thuyết, thực hành, đồ án), theo chương trình đào tạo (chính quy, liên thông, sau đại học), hoặc theo học kỳ.
*   **Danh mục khoản thu:** Thiết lập các loại phí ngoài học phí: phí nội trú/ký túc xá, bảo hiểm y tế, lệ phí thi lại, phí đăng ký muộn, phí xét tốt nghiệp.

#### 2. Theo dõi Hóa đơn & Công nợ
*   **Tạo hóa đơn tự động:** Khi sinh viên hoàn tất đăng ký tín chỉ, hệ thống tự động tính toán học phí dựa trên số tín chỉ × đơn giá, cộng thêm các khoản phí phát sinh → xuất hóa đơn.
*   **Theo dõi công nợ realtime:** Bảng tổng hợp hiển thị: tổng phải đóng, đã đóng, còn nợ, trạng thái (chưa đóng, đang xử lý, đã thanh toán, quá hạn). Cập nhật ngay khi có giao dịch mới.
*   **Danh sách nợ phí:** Quản lý sinh viên chưa hoàn thành nghĩa vụ tài chính, phục vụ xét điều kiện thi/tốt nghiệp.

#### 3. Quy trình Thanh toán & Đối soát
*   **Ghi nhận giao dịch:** Lưu trữ lịch sử thanh toán: mã giao dịch, số tiền, ngày thanh toán, phương thức (chuyển khoản, tiền mặt, QR code), người xác nhận.
*   **Đối soát tài chính:** Báo cáo tổng hợp doanh thu theo: đợt thu, khoa, chương trình đào tạo, khoản thu. Hỗ trợ xuất báo cáo phục vụ kiểm toán.

#### 4. Phân quyền & Hiển thị
*   **Sinh viên:** Tra cứu công nợ cá nhân, xem chi tiết hóa đơn từng kỳ, lịch sử đóng phí.
*   **Admin/Giáo vụ:** Toàn quyền quản lý biểu phí, điều chỉnh hóa đơn, phê duyệt miễn giảm, xem báo cáo.
*   **Giao diện:** `TuitionManagementPage` (66KB — trang nghiệp vụ lớn nhất hệ thống) với nhiều tab: Tổng quan, Chi tiết hóa đơn, Lịch sử giao dịch, Báo cáo.
*   **Truy vết dữ liệu:** Ghi lại mọi thao tác chỉnh sửa số liệu tài chính (ai sửa, sửa gì, lúc nào) — đảm bảo khả năng kiểm toán đầy đủ.

---

### 📝 Nhóm V: Khảo thí và Tốt nghiệp
*Đánh giá kết quả học tập và công nhận hoàn thành chương trình đào tạo.*

#### 1. Module Khảo thí (Exam Module)
*   **Lập kế hoạch thi:** Xây dựng phương án tổ chức thi cho từng đợt thi (giữa kỳ, cuối kỳ, thi lại), bao gồm thời gian, hình thức thi, danh sách môn thi.
*   **Quản lý phòng thi:** Thiết lập danh sách phòng thi, sức chứa, vị trí. Phân bổ sinh viên vào phòng thi theo quy tắc (xáo trộn ngẫu nhiên, chia theo lớp).
*   **Lịch thi chi tiết:** Sắp xếp lịch thi tránh trùng (không cho phép sinh viên thi 2 môn cùng lúc), gán giám thị, phòng thi.
*   **Hiển thị lịch thi:** Tích hợp vào Dashboard của sinh viên — hiển thị lịch thi cá nhân tương ứng với các học phần đã đăng ký.

#### 2. Module Tốt nghiệp (Graduation Module)
*   **Xét điều kiện tốt nghiệp:** Kiểm tra tự động các tiêu chí: đủ số tín chỉ tối thiểu, GPA đạt ngưỡng, hoàn thành tất cả môn bắt buộc, không còn nợ phí, đạt chứng chỉ ngoại ngữ/tin học.
*   **Quản lý chứng chỉ:** Lưu trữ thông tin chứng chỉ bổ trợ: ngoại ngữ (TOEIC, IELTS), tin học (MOS, IC3), kỹ năng mềm — phục vụ xét điều kiện tốt nghiệp.
*   **Cấp phát văn bằng:** Quản lý quy trình từ xét duyệt → phê chuẩn → in bằng → phát bằng. Ghi nhận số hiệu bằng, ngày cấp, loại tốt nghiệp (xuất sắc, giỏi, khá, trung bình).

#### 3. Tính năng quản trị bổ trợ
*   **Kiểm soát quyền hạn (RBAC):** Chỉ Admin hoặc Giáo vụ mới truy cập được chức năng quản lý khảo thí và tốt nghiệp.
*   **Truy vết dữ liệu (Auditing):** Ghi lại danh tính và thời gian cho mọi thao tác nhạy cảm: sửa lịch thi, cập nhật kết quả xét tốt nghiệp, chỉnh sửa thông tin văn bằng.

---

### 📡 Nhóm VI: Hạ tầng và Giao tiếp (Infrastructure Module)
*"Mạch máu" thông tin — giúp hệ thống tương tác mượt mà và duy trì tính minh bạch.*

#### 1. Hệ thống Thông báo Nội bộ (Notification Module)
*   **Thông báo hệ thống:** Gửi notification ngay trên giao diện web — hiển thị số thông báo chưa đọc, danh sách notification mới nhất.
*   **Gửi theo vai trò:** Admin/Giáo vụ gửi thông báo đích danh (cho 1 user) hoặc hàng loạt (cho tất cả sinh viên của 1 lớp, 1 khoa, hoặc toàn trường).
*   **Phân loại thông báo:** Thông báo chung, thông báo học tập (lịch học, lịch thi), thông báo tài chính (nhắc đóng phí), thông báo khẩn.

#### 2. Hệ thống Email Tự động (Email Module)
*   **Hạ tầng gửi thư:** Tích hợp SMTP để gửi email từ hệ thống đến email cá nhân của user.
*   **Email Template:** Chuẩn hóa mẫu nội dung cho các sự kiện: thư chào mừng (Welcome), thông báo OTP, xác nhận đăng ký thành công, biên lai thanh toán, nhắc nợ học phí.
*   **Event-driven:** Tự động kích hoạt gửi email khi phát sinh sự kiện nghiệp vụ: tạo tài khoản thành công, có điểm mới, hóa đơn được tạo, đăng ký tín chỉ hoàn tất.

#### 3. Hạ tầng Kỹ thuật & Cấu hình (Core Infrastructure)
*   **JPA Auditing:** Ghi nhận `created_by`, `updated_by`, `created_at`, `updated_at` cho toàn bộ entity trên hệ thống.
*   **Axios Interceptor:** Tự động đính kèm JWT Token và xử lý lỗi bảo mật tập trung (401 → logout, 403 → thông báo).
*   **Auth Persistence:** Zustand + localStorage giữ trạng thái đăng nhập và thông tin user qua các lần reload/đóng mở trình duyệt.
*   **System Config Module:** Quản lý các cấu hình hệ thống động (tên trường, logo, thời gian đăng ký, cấu hình email,...) qua giao diện `SystemConfigPage` — không cần sửa code.

---

## 🗂️ Phần 3: Cơ sở Dữ liệu — 13 Nhóm Bảng

Database được thiết kế với **13 nhóm bảng** riêng biệt, quản lý qua **23 phiên bản Flyway Migration**:

| # | Nhóm | Bảng chính | Mô tả | Migration |
|---|---|---|---|---|
| I | **Auth & Security** | `users`, `roles`, `permissions`, `user_roles`, `role_permissions` | Xác thực, phân quyền RBAC | V1, V15 |
| II | **Sinh viên** | `students`, `student_classes`, `student_status` | Hồ sơ SV, lớp, trạng thái | V3, V18 |
| III | **Giảng viên & Nhân sự** | `lecturers`, `departments`, `faculties` | Hồ sơ GV, khoa, bộ môn | V2, V16 |
| IV | **Chương trình ĐT** | `programs`, `courses`, `prerequisites` | CTĐT, học phần, tiên quyết | V4, V17 |
| V | **Học kỳ** | `semesters`, `academic_years`, `course_sections` | Niên khóa, HK, lớp HP | V5, V20 |
| VI | **Đăng ký** | `registration_periods`, `registrations` | Đợt ĐK, đăng ký tín chỉ | V6, V19 |
| VII | **Thời khóa biểu** | `schedules`, `schedule_details` | Lịch học, phòng, giảng viên | V7 |
| VIII | **Điểm số** | `grades`, `grade_components` | Điểm thành phần, tổng hợp | V8 |
| IX | **Học phí** | `tuition_fees`, `fee_categories`, `invoices`, `payments` | Biểu phí, hóa đơn, thanh toán | V9, V21, V23 |
| X | **Khảo thí** | `exams`, `exam_rooms`, `exam_schedules` | Đợt thi, phòng thi, lịch thi | V10 |
| XI | **Tốt nghiệp** | `graduations`, `certificates`, `diplomas` | Xét TN, chứng chỉ, văn bằng | V11 |
| XII | **Thông báo** | `notifications`, `notification_recipients` | Thông báo nội bộ | V12 |
| XIV | **Email** | `email_templates`, `email_logs` | Mẫu email, lịch sử gửi | V13 |

> **Đặc điểm thiết kế chung:**
> - Tất cả bảng sử dụng `UNIQUEIDENTIFIER` (UUID) làm khóa chính
> - Soft delete pattern: `is_active`, `deleted_at`, `deleted_by`
> - Audit trail: `created_at`, `updated_at`, `created_by`, `updated_by`
> - Foreign Key constraints giữa các nhóm bảng
> - Performance indexes được thêm tại V14

---

## 🧰 Phần 4: Tech Stack Chi tiết

### Backend Stack

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **Spring Boot** | 4.0.6 | Application framework chính |
| **Spring Security** | 6.x | Authentication & Authorization |
| **Spring Data JPA** | 3.x | ORM — ánh xạ Entity ↔ Database |
| **Hibernate** | 6.x | JPA Implementation |
| **Flyway** | 10.x | Database migration management |
| **SpringDoc OpenAPI** | 3.0.0-RC1 | Swagger UI / API documentation |
| **JJWT** | 0.12.6 | JWT Token generation & validation |
| **Lombok** | Latest | Giảm boilerplate code (@Data, @Builder, ...) |
| **SQL Server JDBC** | Runtime | Microsoft SQL Server driver |
| **Spring Boot Actuator** | 4.0.6 | Health check & monitoring |
| **Bean Validation** | 3.x | Request DTO validation |
| **Java** | 21 | Runtime platform |
| **Maven** | 3.9+ | Build & dependency management |

### Frontend Stack

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **React** | 19.2.5 | UI component library |
| **Vite** | 8.0.10 | Lightning-fast build tool & dev server |
| **TailwindCSS** | 4.2.4 | Utility-first CSS framework |
| **Zustand** | 5.0.12 | Lightweight global state management |
| **Axios** | 1.15.2 | HTTP client với interceptor support |
| **React Router DOM** | 7.14.2 | Client-side routing & navigation |
| **React Hook Form** | 7.73.1 | Form validation & management |
| **React Hot Toast** | 2.6.0 | Beautiful toast notifications |
| **Lucide React** | 1.11.0 | Modern icon library (700+ icons) |
| **QRCode.react** | 4.2.0 | QR Code generation cho thanh toán |

### Infrastructure

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **Docker** | Latest | Containerization |
| **Docker Compose** | v2 | Multi-container orchestration |
| **Microsoft SQL Server** | 2022 | Relational database management |

---

## 🎨 Phần 5: Giao diện Người dùng

### Danh sách Trang (Pages)

| Trang | File | Mô tả | Quyền truy cập |
|---|---|---|---|
| **Đăng nhập** | `LoginPage.jsx` (16KB) | Form login với validation, remember me | Public |
| **Đăng ký** | `RegisterPage.jsx` (18KB) | Đăng ký tài khoản mới | Public |
| **Quên mật khẩu** | `ForgotPasswordPage.jsx` (16KB) | Khôi phục mật khẩu qua email | Public |
| **Dashboard** | `DashboardPage.jsx` (4KB) | Trang chủ với widget theo vai trò | Authenticated |
| **Hồ sơ cá nhân** | `ProfilePage.jsx` (19KB) | Xem/sửa thông tin cá nhân | Authenticated |
| **ER Diagram** | `ERDiagramView.jsx` (9KB) | Hiển thị sơ đồ quan hệ database | Admin |
| **Cấu hình hệ thống** | `SystemConfigPage.jsx` (27KB) | Quản lý cài đặt hệ thống | Admin |
| **Quản lý SV** | `StudentListPage.jsx` (24KB) | CRUD sinh viên, tìm kiếm, phân trang | Admin, Giáo vụ |
| **Cấu trúc lớp** | `ClassHierarchyPage.jsx` (21KB) | Quản lý lớp hành chính | Admin, Giáo vụ |
| **Quản lý GV** | `LecturerManagementPage.jsx` (23KB) | CRUD giảng viên | Admin, Giáo vụ |
| **Quản lý học phần** | `CourseManagementPage.jsx` (18KB) | CRUD môn học, chương trình | Admin, Giáo vụ |
| **Quản lý đào tạo** | `AcademicManagementPage.jsx` (27KB) | Học kỳ, lớp HP, đăng ký | Admin, Giáo vụ |
| **Quản lý học phí** | `TuitionManagementPage.jsx` (67KB) | Biểu phí, hóa đơn, công nợ | Admin, Giáo vụ |

### Shared Components

| Component | Mô tả |
|---|---|
| `MainLayout.jsx` (21KB) | Layout chính: Header + Sidebar + Content |
| `Sidebar.jsx` | Dynamic menu theo vai trò |
| `StudentFormModal.jsx` | Modal thêm/sửa sinh viên |
| `StudentDetailModal.jsx` | Modal xem chi tiết sinh viên |
| `StudentStatusModal.jsx` | Modal cập nhật trạng thái SV |
| `ClassDetailModal.jsx` | Modal chi tiết lớp hành chính |
| `ProfileEditModal.jsx` | Modal chỉnh sửa hồ sơ cá nhân |
| `ProtectedRoute.jsx` | Route guard — yêu cầu đăng nhập |
| `PublicRoute.jsx` | Route guard — chỉ cho public |

---

## 🛡️ Phần 6: Bảo mật & Phân quyền Chi tiết

### Ma trận Phân quyền RBAC

| Module / Quyền | ADMIN | GIAOVU | GIANGVIEN | SINHVIEN |
|---|:---:|:---:|:---:|:---:|
| `USER_CREATE` — Tạo tài khoản | ✅ | ❌ | ❌ | ❌ |
| `USER_READ` — Xem tài khoản | ✅ | ❌ | ❌ | ❌ |
| `USER_UPDATE` — Sửa tài khoản | ✅ | ❌ | ❌ | ❌ |
| `USER_DELETE` — Xóa tài khoản | ✅ | ❌ | ❌ | ❌ |
| `STUDENT_CREATE` — Tạo hồ sơ SV | ✅ | ✅ | ❌ | ❌ |
| `STUDENT_READ` — Xem hồ sơ SV | ✅ | ✅ | ❌ | ❌ |
| `COURSE_MANAGE` — Quản lý học phần | ✅ | ✅ | ❌ | ❌ |
| `COURSE_READ` — Xem học phần | ✅ | ✅ | ✅ | ✅ |
| `REGISTRATION_MANAGE` — Quản lý đăng ký | ✅ | ✅ | ❌ | ❌ |
| `REGISTRATION_REGISTER` — Đăng ký tín chỉ | ✅ | ✅ | ❌ | ✅ |
| `GRADE_INPUT` — Nhập điểm | ✅ | ✅ | ✅ | ❌ |
| `GRADE_READ` — Xem điểm | ✅ | ✅ | ✅ | ✅ |
| `FINANCE_MANAGE` — Quản lý tài chính | ✅ | ✅ | ❌ | ❌ |
| `FINANCE_READ` — Xem học phí | ✅ | ✅ | ❌ | ✅ |

### Luồng Xác thực JWT

```
1. Client gửi POST /api/v1/auth/login { username, password }
2. Server kiểm tra credentials → BCrypt.matches(password, hash)
3. Server sinh JWT Token:
   - Header: { alg: "HS256" }
   - Payload: { sub: userId, username, roles: ["ADMIN"], iat, exp }
   - Signature: HMAC-SHA256(header + payload, secretKey)
4. Client lưu Token vào localStorage (qua Zustand persist)
5. Mọi request tiếp theo: Header "Authorization: Bearer <token>"
6. Server JwtFilter: decode token → load UserDetails → set SecurityContext
7. @PreAuthorize kiểm tra role/permission → cho phép hoặc từ chối
```

---

## 📡 Phần 7: API Endpoints

### Tổng quan Nhóm API

| Nhóm | Base Path | Phương thức | Mô tả |
|---|---|---|---|
| **Auth** | `/api/v1/auth` | POST, GET | Login, Register, /me, Forgot Password |
| **Users** | `/api/v1/users` | GET, POST, PUT, DELETE | CRUD tài khoản người dùng |
| **Students** | `/api/v1/students` | GET, POST, PUT, DELETE | CRUD hồ sơ sinh viên |
| **Lecturers** | `/api/v1/lecturers` | GET, POST, PUT, DELETE | CRUD giảng viên |
| **Courses** | `/api/v1/courses` | GET, POST, PUT, DELETE | Danh mục học phần |
| **Departments** | `/api/v1/departments` | GET | Danh sách khoa/bộ môn |
| **Semesters** | `/api/v1/semesters` | GET, POST, PUT | Quản lý học kỳ, lớp HP |
| **Registrations** | `/api/v1/registrations` | GET, POST, PUT | Đăng ký tín chỉ |
| **Tuitions** | `/api/v1/tuitions` | GET, POST, PUT | Học phí, hóa đơn, công nợ |
| **Notifications** | `/api/v1/notifications` | GET, POST | Thông báo nội bộ |
| **Profile** | `/api/v1/profile` | GET, PUT | Hồ sơ cá nhân |
| **System Config** | `/api/v1/system-config` | GET, PUT | Cấu hình hệ thống |
| **Admin** | `/api/v1/admin` | GET, POST, PUT, DELETE | Quản trị nâng cao |

### Swagger UI

Sau khi Backend chạy, truy cập tài liệu API tương tác:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs

---

## 🚀 Hướng dẫn Cài đặt Nhanh

> 📘 **Hướng dẫn chi tiết đầy đủ** xem tại file [INSTRUC.md](./INSTRUC.md)

### Yêu cầu

- Docker Desktop 4.x + Docker Compose
- Java JDK 21
- Node.js 18+ & npm 9+

### 3 Bước Khởi động

```bash
# Bước 1: Khởi động Database
cd docker
docker compose up -d
# Tạo database (PowerShell)
docker exec -it uni_it_sqlserver /opt/mssql-tools18/bin/sqlcmd `
  -S 127.0.0.1 -U sa -P UniItAdmin2026 `
  -C -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'stdmanager_db') CREATE DATABASE stdmanager_db"

# Bước 2: Chạy Backend
cd ../stdmanager
mvn clean
mvn spring-boot:run
# → http://localhost:8080 | Swagger: http://localhost:8080/swagger-ui.html

# Bước 3: Chạy Frontend
cd ../frontend
npm install
npm run dev
# → http://localhost:5173
```

### Tài khoản Mặc định

| Vai trò | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@123` |
| Giáo vụ | `giaovu` | `Admin@123` |

---

## 🤝 Đóng góp & Liên hệ

### Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/ten-tinh-nang`)
3. Commit changes (`git commit -m "Add: mô tả thay đổi"`)
4. Push branch (`git push origin feature/ten-tinh-nang`)
5. Tạo Pull Request

### Quy ước Commit Message

```
Add:    Thêm tính năng mới
Fix:    Sửa lỗi
Update: Cập nhật tính năng
Refactor: Tái cấu trúc code
Docs:   Cập nhật tài liệu
Style:  Chỉnh sửa giao diện
```

### Cấu trúc Branch

```
main            ← Production-ready code
├── develop     ← Development integration
├── feature/*   ← Tính năng mới
├── bugfix/*    ← Sửa lỗi
└── hotfix/*    ← Sửa lỗi khẩn cấp
```

---

<div align="center">

**📝 Cập nhật lần cuối:** Tháng 5, 2026

Xây dựng với ❤️ bởi đội ngũ phát triển **stdmanager**

**[Spring Boot 4](https://spring.io/projects/spring-boot) • [React 19](https://react.dev) • [SQL Server 2022](https://www.microsoft.com/sql-server) • [Docker](https://docker.com)**

</div>