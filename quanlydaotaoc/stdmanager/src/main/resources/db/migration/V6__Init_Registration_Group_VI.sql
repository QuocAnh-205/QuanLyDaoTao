-- stdmanager/src/main/resources/db/migration/V6__Init_Registration_Group_VI.sql

USE stdmanager_db
GO

-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS course_registrations;
GO

CREATE TABLE course_registrations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính 
    student_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng students 
    course_section_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng course_sections 
    registration_period_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng registration_periods 
    registration_type TINYINT NOT NULL, -- 1: Học mới; 2: Học lại; 3: Cải thiện 
    replaced_grade_id UNIQUEIDENTIFIER NULL, -- ID điểm cũ nếu học lại/cải thiện 
    registered_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm thực hiện đăng ký 
    status TINYINT DEFAULT 1, -- 1: Thành công; 2: Chờ thanh toán; 3: Đã hủy [cite: 22]
    is_paid BIT DEFAULT 0, -- Trạng thái thanh toán [cite: 22]
    row_version ROWVERSION, -- Xử lý tranh chấp dữ liệu (concurrency) [cite: 22]

    -- Các trường thông tin hệ thống [cite: 22]
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER
);




-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS equivalent_courses;
GO


CREATE TABLE equivalent_courses (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính 
    original_course_id UNIQUEIDENTIFIER NOT NULL, -- FK môn cũ/gốc 
    equivalent_course_id UNIQUEIDENTIFIER NOT NULL, -- FK môn mới/thay thế 
    equivalence_type TINYINT NOT NULL, -- 1: Thay thế hoàn toàn; 2: Tương đương song song 
    effect_date DATE DEFAULT GETDATE(), -- Ngày bắt đầu áp dụng 
    note NVARCHAR(500), -- Lý do tương đương 
    
    -- Các trường thông tin hệ thống 
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,

    -- Ràng buộc tránh trùng lặp môn gốc và môn tương đương
    CONSTRAINT CHK_NotSameCourse CHECK (original_course_id <> equivalent_course_id)
);



-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS registration_periods;
GO

CREATE TABLE registration_periods (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính [cite: 16]
    name NVARCHAR(200) NOT NULL, -- Tên đợt đăng ký [cite: 16]
    semester_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng semesters [cite: 16]
    start_time DATETIME2 NOT NULL, -- Thời điểm bắt đầu [cite: 17]
    end_time DATETIME2 NOT NULL, -- Thời điểm kết thúc [cite: 17]
    target_config NVARCHAR(MAX), -- Cấu hình đối tượng dạng JSON (Khóa, Khoa...) [cite: 18]
    max_credits TINYINT DEFAULT 25, -- Số tín chỉ tối đa [cite: 18]
    min_credits TINYINT DEFAULT 12, -- Số tín chỉ tối thiểu [cite: 19]
    allow_retake BIT DEFAULT 1, -- Cho phép học lại/cải thiện [cite: 19]
    
    -- Các trường thông tin hệ thống [cite: 20]
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,

    -- Ràng buộc logic thời gian
    CONSTRAINT CHK_RegistrationTime CHECK (end_time > start_time)
);