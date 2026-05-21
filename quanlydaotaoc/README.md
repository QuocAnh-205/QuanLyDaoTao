# 🎓 Tổng hợp Quy trình Triển khai Dự án: University IT Management System (stdmanager)

Tài liệu này tổng hợp toàn bộ các giai đoạn triển khai và tính năng nghiệp vụ của hệ thống quản lý thông tin đại học **stdmanager** từ giai đoạn khởi tạo đến hoàn thiện.

---

## 🏗️ Phần 1: Các Giai đoạn Triển khai Hệ thống (Development Phases)

Dưới đây là lộ trình xây dựng hệ thống từ nền tảng kỹ thuật đến trải nghiệm người dùng cuối.

### 🏗️ Giai đoạn 1: Thiết lập hạ tầng & Cơ sở dữ liệu (Infrastructure)
*Bước đặt nền móng, đảm bảo dữ liệu có nơi trú ngụ an toàn và quy trình quản lý chuyên nghiệp.*

*   **Docker hóa Database:** Triển khai SQL Server trên Docker để đồng bộ môi trường phát triển cho toàn đội ngũ.
*   **Thiết kế Schema 13 nhóm bảng:** Quy hoạch toàn bộ cấu trúc dữ liệu từ sinh viên, giảng viên, học phí đến lịch thi.
*   **Flyway Migration:** Sử dụng Flyway để quản lý phiên bản cơ sở dữ liệu (từ `V1` đến `V14`), giúp việc nâng cấp database trở nên tự động và không bị lỗi xung đột.

### ⚙️ Giai đoạn 2: Xây dựng "Xương sống" Backend (Core Engine)
*Thiết lập bộ khung logic cho Spring Boot 3 để xử lý các yêu cầu nghiệp vụ phức tạp.*

*   **Cấu trúc dự án:** Phân chia theo kiến trúc Layered Architecture (Controller - Service - Repository - Entity).
*   **Base Components:** Xây dựng `BaseEntity` (tự động lưu thời gian tạo/sửa) và `ApiResponse` (chuẩn hóa dữ liệu trả về cho Frontend).
*   **Global Exception Handling:** Thiết lập bộ bắt lỗi tập trung, đảm bảo hệ thống không bao giờ "văng" lỗi thô ra màn hình người dùng.
*   **JPA Auditing:** Tự động hóa việc ghi nhận ai là người tạo hoặc cập nhật dữ liệu.

### 🛡️ Giai đoạn 3: Bảo mật & Xác thực (Security & Identity)
*Xây dựng "tường lửa" để bảo vệ dữ liệu nhạy cảm của nhà trường.*

*   **Spring Security 6 & JWT:** Triển khai xác thực không trạng thái (Stateless) bằng mã thông báo JSON Web Token.
*   **RBAC (Role-Based Access Control):** Thiết lập phân quyền chi tiết cho 4 nhóm người dùng: Admin, Giảng viên, Sinh viên, Nhân viên.
*   **Xử lý lỗi hạ tầng:** Giải quyết các vấn đề phức tạp như Vòng lặp phụ thuộc (Circular Dependency) và xung đột phiên bản thư viện (NoSuchMethodError).

### 🔌 Giai đoạn 4: Cổng giao tiếp & Tài liệu hóa (API Documentation)
*Tạo ra "bản hợp đồng" để Frontend và Backend hiểu nhau.*

*   **OpenAPI 3 (Swagger UI):** Tự động hóa tài liệu API, cho phép thử nghiệm trực tiếp trên trình duyệt.
*   **Cấu hình CORS:** Phá bỏ rào cản trình duyệt, cho phép ứng dụng React (Vite) gọi API tới Spring Boot một cách an toàn.
*   **Chuẩn hóa DTO:** Sử dụng Data Transfer Object để đóng gói dữ liệu, tăng tính bảo mật và hiệu suất truyền tải.

### 🎨 Giai đoạn 5: Frontend Connectivity & Dynamic UI (Giao diện động)
*Biến các API thành trải nghiệm người dùng thực tế.*

*   **State Management (Zustand):** Quản lý trạng thái đăng nhập và thông tin người dùng toàn cục, hỗ trợ lưu trữ bền vững (Persistence).
*   **Axios Interceptor:** Tự động đính kèm Token vào Header và xử lý lỗi 401 (hết hạn phiên làm việc).
*   **Route Guarding:** Bảo vệ các tuyến đường, chỉ cho phép người dùng đã đăng nhập và đúng quyền hạn mới được truy cập.
*   **MainLayout & Dynamic Sidebar:** Xây dựng giao diện Sidebar tự động co giãn và hiển thị các mục menu dựa trên vai trò của người dùng.

---

## 📦 Phần 2: Chi tiết Các Module Nghiệp vụ

Hệ thống được chia thành các nhóm chức năng riêng biệt, tương tác chặt chẽ với nhau.

### 🔐 Nhóm I: Quản trị và Bảo mật (Auth Module)
*Đóng vai trò là "người gác cổng" và điều phối toàn bộ quyền hạn trong hệ thống.*

#### 1. Xác thực người dùng (Authentication)
*   **Đăng nhập hệ thống:** Tiếp nhận và kiểm tra thông tin định danh (Username/Password) từ người dùng thông qua endpoint `/api/v1/auth/login`.
*   **Cấp phát mã thông báo (JWT Issue):** Sau khi xác thực thành công, hệ thống sinh mã JSON Web Token (JWT) chứa thông tin định danh và quyền hạn.
*   **Kiểm tra trạng thái xác thực:** Cung cấp tính năng xác minh mã thông báo hiện tại còn hiệu lực hay không qua endpoint `/me`.

#### 2. Quản lý phân quyền (Authorization - RBAC)
*   **Phân quyền dựa trên vai trò:** Gán và kiểm soát quyền hạn dựa trên 4 nhóm vai trò chính: Admin, Giảng viên, Sinh viên, Nhân viên.
*   **Bảo vệ tài nguyên phía Server:** Sử dụng các bộ lọc bảo mật và chú thích `@PreAuthorize` để chặn các yêu cầu không đủ thẩm quyền.
*   **Điều hướng động phía Client:** Tự động lọc danh sách menu hiển thị trên Sidebar và bảo vệ các tuyến đường (Route Guarding).

#### 3. Bảo mật hạ tầng và Giao tiếp
*   **Cấu hình CORS:** Cho phép các ứng dụng Frontend tin cậy gửi yêu cầu và nhận dữ liệu từ Backend một cách an toàn.
*   **Xác thực không trạng thái (Stateless Security):** Hệ thống không lưu trữ phiên làm việc (Session) trên Server, tăng hiệu suất và khả năng mở rộng.
*   **Truy vết hoạt động (Auditing):** Kết hợp với JPA Auditing để tự động ghi nhận danh tính người thực hiện thao tác tạo/cập nhật dữ liệu.

#### 4. Tích hợp hệ thống Frontend (Auth Integration)
*   **Quản lý trạng thái toàn cục:** Sử dụng `useAuthStore` để lưu trữ bền vững Token trong `localStorage`, giúp duy trì phiên làm việc.
*   **Tự động hóa giao tiếp (Interceptor):** Tự động đính kèm mã JWT vào Header và xử lý các mã lỗi 401, 403 để điều hướng người dùng.

---

### 👥 Nhóm Quản lý Người dùng (User Module)
*Tập hợp các chức năng cốt lõi để quản lý "thực thể" con người trong hệ thống.*

#### 1. Module Sinh viên (Student Module)
*Quản lý toàn bộ vòng đời của một sinh viên tại trường.*
*   **Quản lý hồ sơ định danh:** Lưu trữ chi tiết thông tin cá nhân, mã số sinh viên (MSSV) và thông tin liên lạc.
*   **Theo dõi trạng thái học tập:** Cập nhật tình trạng: Đang học, Bảo lưu, Thôi học, Đã tốt nghiệp.
*   **Phân quyền trải nghiệm:** Cho phép sinh viên truy cập tính năng đặc thù (tra cứu điểm, xem lịch, công nợ).
*   **Liên kết tài khoản:** Mỗi hồ sơ sinh viên được gắn chặt với một tài khoản User để đăng nhập và bảo mật.

#### 2. Module Giảng viên & Nhân viên (Lecturer/Staff Module)
*Quản lý đội ngũ nhân sự vận hành nhà trường.*
*   **Quản lý hồ sơ nhân sự:** Lưu trữ thông tin chuyên môn, học vị và thông tin liên lạc.
*   **Phân định quyền hạn nghiệp vụ:**
    *   *Giảng viên:* Quyền quản lý lớp học, nhập điểm, xem lịch giảng dạy.
    *   *Nhân viên:* Quyền quản lý hồ sơ, điều phối chương trình đào tạo hoặc quản lý tài chính.

#### 3. Tính năng quản trị chung (Core User Features)
*   **Quản lý dữ liệu (CRUD):** Cung cấp giao diện và API để Thêm, Cập nhật, Xóa, Liệt kê người dùng.
*   **Tự động truy vết (Auditing):** Ghi lại danh tính người thực hiện và thời điểm tạo/sửa hồ sơ.
*   **Bảo vệ dữ liệu:** Áp dụng kiểm tra quyền hạn mức phương thức (`@PreAuthorize("hasRole('ADMIN')")`).
*   **Tìm kiếm và Lọc:** Hỗ trợ tìm kiếm theo mã định danh, tên hoặc trạng thái.

---

### 🏫 Nhóm Học thuật và Đào tạo (Academic Module)
*Trung tâm vận hành các hoạt động giáo dục, từ xây dựng chương trình đến đánh giá kết quả.*

#### 1. Quản lý Chương trình & Học phần
*   **Xây dựng khung chương trình:** Thiết lập cấu trúc chương trình đào tạo và sơ đồ cây môn học.
*   **Quản lý danh mục học phần:** Lưu trữ thông tin môn học, số tín chỉ và điều kiện tiên quyết.
*   **Thời gian biểu học thuật:** Định nghĩa các niên khóa, học kỳ và các cột mốc thời gian quan trọng.

#### 2. Đăng ký Học phần
*   **Điều phối đợt đăng ký:** Thiết lập khoảng thời gian cho phép sinh viên đăng ký môn học trực tuyến.
*   **Xử lý đăng ký:** Tiếp nhận và phê duyệt danh sách sinh viên vào các lớp học phần.

#### 3. Tổ chức Lịch học & Lịch dạy
*   **Xây dựng thời khóa biểu:** Sắp xếp lịch học, phòng học và phân bổ giảng viên.
*   **Cung cấp lịch cá nhân:**
    *   *Sinh viên:* Hiển thị lịch học cá nhân trên Dashboard.
    *   *Giảng viên:* Hiển thị chi tiết lịch giảng dạy, danh sách lớp.

#### 4. Quản lý Điểm & Kết quả học tập
*   **Vận hành quy trình nhập điểm:** Công cụ cho giảng viên ghi nhận và quản lý điểm số.
*   **Quản lý kết quả:** Lưu trữ bảng điểm tổng hợp và quy trình xét duyệt.
*   **Tra cứu kết quả:** Cho phép xem lại lịch sử học tập và kết quả điểm số.

---

### 💰 Nhóm Tài chính (Finance Module)
*Quản lý dòng tiền liên quan đến nghĩa vụ học tập, đảm bảo tính minh bạch.*

#### 1. Quản lý Định mức & Biểu phí
*   **Thiết lập cấu hình học phí:** Định nghĩa định mức dựa trên tín chỉ, loại học phần hoặc học kỳ.
*   **Quản lý danh mục khoản thu:** Thiết lập các loại phí ngoài học phí (phí nội trú, bảo hiểm, lệ phí hành chính).

#### 2. Theo dõi Hóa đơn & Công nợ
*   **Khởi tạo hóa đơn tự động:** Dựa trên đăng ký học phần để tính toán và xuất hóa đơn.
*   **Theo dõi công nợ:** Cập nhật tình trạng đóng phí thời gian thực, quản lý danh sách sinh viên nợ phí.

#### 3. Quy trình Thanh toán & Đối soát
*   **Ghi nhận giao dịch:** Lưu trữ lịch sử thanh toán, mã giao dịch và phương thức thanh toán.
*   **Đối soát tài chính:** Cung cấp báo cáo tổng hợp doanh thu theo đợt thu hoặc đơn vị đào tạo.

#### 4. Phân quyền truy cập & Hiển thị
*   **Giao diện Sinh viên:** Tra cứu công nợ, xem lịch sử đóng phí, nhận thông báo nhắc nợ.
*   **Giao diện Admin/Tài chính:** Toàn quyền điều chỉnh hóa đơn, phê duyệt miễn giảm, quản lý báo cáo.
*   **Truy vết dữ liệu:** Ghi lại mọi thao tác chỉnh sửa số liệu tài chính để đảm bảo khả năng kiểm toán.

---

### 📝 Nhóm Khảo thí và Tốt nghiệp
*Đánh giá kết quả học tập và công nhận hoàn thành chương trình đào tạo.*

#### 1. Module Khảo thí (Exam Module)
*   **Lập kế hoạch tổ chức thi:** Xây dựng phương án cho các đợt thi cử.
*   **Quản lý phòng thi:** Tổ chức và quản lý danh sách phòng thi.
*   **Quản lý lịch thi:** Thiết lập lịch thi định kỳ.
*   **Hiển thị lịch thi:** Tích hợp hiển thị trực tiếp trên giao diện người dùng tương ứng với các học phần.

#### 2. Module Tốt nghiệp (Graduation Module)
*   **Xét điều kiện tốt nghiệp:** Kiểm tra hồ sơ để xác định điều kiện đủ tốt nghiệp.
*   **Quản lý chứng chỉ:** Lưu trữ thông tin chứng chỉ trong quá trình học tập.
*   **Cấp phát văn bằng:** Quản lý quy trình cấp phát bằng tốt nghiệp.

#### 3. Tính năng quản trị bổ trợ
*   **Kiểm soát quyền hạn (RBAC):** Đảm bảo chỉ Admin hoặc Nhân viên đào tạo mới truy cập được các chức năng quản lý.
*   **Truy vết dữ liệu (Auditing):** Ghi lại danh tính và thời gian cập nhật các thao tác quan trọng (sửa lịch thi, xét tốt nghiệp).

---

### 📡 Nhóm Hạ tầng và Giao tiếp (Infrastructure Module)
*Là "mạch máu" thông tin, giúp hệ thống tương tác mượt mà và duy trì tính minh bạch.*

#### 1. Hệ thống Thông báo nội bộ (Notification Module)
*   **Vận hành thông báo hệ thống:** Gửi thông báo nội bộ ngay trên giao diện ứng dụng.
*   **Gửi tin nhắn theo vai trò:** Gửi thông báo đích danh hoặc hàng loạt đến nhóm đối tượng cụ thể (Admin, Giảng viên, Sinh viên, Nhân viên).
*   **Tương tác thời gian thực:** Đảm bảo người dùng nhận thông tin quan trọng (lịch học, lịch thi, biến động học phí) kịp thời.

#### 2. Hệ thống Email tự động (Email Module)
*   **Quản lý hạ tầng gửi thư:** Gửi email tự động từ hệ thống đến email cá nhân.
*   **Thiết kế mẫu nội dung (Template):** Chuẩn hóa nội dung (Thư chào mừng, thông báo OTP, xác nhận thanh toán).
*   **Tự động hóa giao tiếp:** Kích hoạt gửi email dựa trên sự kiện nghiệp vụ (có điểm mới, tạo tài khoản thành công).

#### 3. Hạ tầng Kỹ thuật & Truy vết (Core Infrastructure)
*   **Tự động truy vết (JPA Auditing):** Ghi lại danh tính và thời điểm tạo/cập nhật dữ liệu toàn hệ thống.
*   **Giao tiếp API an toàn (Axios Interceptor):** Tự động đính kèm JWT và xử lý lỗi bảo mật tập trung (401, 403).
*   **Duy trì phiên làm việc (Auth Persistence):** Giữ trạng thái đăng nhập và thông tin người dùng ngay cả khi tải lại trình duyệt.
```