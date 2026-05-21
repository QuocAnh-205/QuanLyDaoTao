-- stdmanager/src/main/resources/db/migration/V13__Init_Email_Group_XIV.sql

-- 1. Bảng email_templates: Lưu trữ các mẫu email (tiêu đề, nội dung HTML) dùng chung 104]
CREATE TABLE email_templates (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính mẫu email
    name NVARCHAR(255) NOT NULL, -- Tên mẫu email
    subject NVARCHAR(255), -- Tiêu đề mặc định của email
    body_html NVARCHAR(MAX), -- Nội dung email định dạng HTML
    is_active BIT DEFAULT 1, -- Trạng thái sử dụng
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo mẫu
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật cuối
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER -- Người thực hiện xóa
);
GO

-- 2. Bảng smtp_configs: Lưu cấu hình kết nối máy chủ gửi email (SMTP) 115]
CREATE TABLE smtp_configs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính cấu hình
    host NVARCHAR(255) NOT NULL, -- Máy chủ SMTP
    port INT, -- Cổng SMTP
    username NVARCHAR(255), -- Tên đăng nhập
    password NVARCHAR(255), -- Mật khẩu (đã mã hóa)
    encryption NVARCHAR(50), -- TLS / SSL
    is_active BIT DEFAULT 1, -- Cấu hình đang sử dụng
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo cấu hình
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật
    deleted_at DATETIME2, -- Thời điểm xóa
    deleted_by UNIQUEIDENTIFIER -- Người xóa
);
GO

-- 3. Bảng email_groups: Định nghĩa nhóm người nhận (theo lớp, khoa, hoặc loại đối tượng) 108]
CREATE TABLE email_groups (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    group_name NVARCHAR(200) NOT NULL, -- Tên nhóm người nhận
    group_type NVARCHAR(100), -- Loại nhóm (Lớp/Khoa/SV)
    description NVARCHAR(500), -- Mô tả nhóm
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo nhóm
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật nhóm
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER -- Người thực hiện xóa
);
GO

-- 4. Bảng email_queue: Hàng đợi chứa các email đang chờ hệ thống gửi tự động 111]
CREATE TABLE email_queue (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính hàng đợi
    recipient_email NVARCHAR(255) NOT NULL, -- Email người nhận
    template_id UNIQUEIDENTIFIER, -- Khóa ngoại liên kết email_templates
    status TINYINT DEFAULT 1, -- Trạng thái (1: PENDING, 2: SENT, 3: FAILED)
    retry_count INT DEFAULT 0, -- Số lần gửi lại
    scheduled_at DATETIME2, -- Thời gian dự kiến gửi
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo lệnh
    updated_at DATETIME2, -- Thời điểm cập nhật trạng thái
    created_by UNIQUEIDENTIFIER, -- Người/Hệ thống kích hoạt lệnh
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật trạng thái
    deleted_at DATETIME2, -- Thời điểm hủy lệnh gửi
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện hủy
    CONSTRAINT FK_EmailQueue_Templates FOREIGN KEY (template_id) REFERENCES email_templates(id)
);
GO

-- 5. Bảng email_attachments: Quản lý các tệp tin đính kèm gắn với email 106]
CREATE TABLE email_attachments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    email_queue_id UNIQUEIDENTIFIER NOT NULL, -- Thuộc email_queue
    file_name NVARCHAR(255), -- Tên file
    file_path NVARCHAR(500), -- Đường dẫn lưu trữ
    file_type NVARCHAR(50), -- Loại file
    is_active BIT DEFAULT 1, -- Trạng thái
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo đính kèm
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật
    deleted_at DATETIME2, -- Thời điểm xóa
    deleted_by UNIQUEIDENTIFIER, -- Người xóa
    CONSTRAINT FK_EmailAttachments_Queue FOREIGN KEY (email_queue_id) REFERENCES email_queue(id)
);
GO

-- 6. Bảng email_logs: Nhật ký lưu lại lịch sử và kết quả của các email đã gửi 118]
CREATE TABLE email_logs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính log email
    template_id UNIQUEIDENTIFIER, -- Khóa ngoại liên kết email_templates
    sender_email VARCHAR(255), -- Email người gửi
    recipient_email VARCHAR(255), -- Email người nhận
    subject NVARCHAR(500), -- Tiêu đề email đã gửi
    body_html NVARCHAR(MAX), -- Nội dung email đã gửi
    status TINYINT, -- Trạng thái (1: SUCCESS, 2: FAILED)
    error_message NVARCHAR(MAX), -- Thông báo lỗi nếu có
    sent_at DATETIME2, -- Thời điểm gửi thành công
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực của bản ghi log
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo log
    updated_at DATETIME2, -- Thời điểm cập nhật log
    created_by UNIQUEIDENTIFIER, -- Hệ thống ghi nhận log
    deleted_at DATETIME2, -- Thời điểm ẩn log
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện ẩn
    CONSTRAINT FK_EmailLogs_Templates FOREIGN KEY (template_id) REFERENCES email_templates(id)
);
GO