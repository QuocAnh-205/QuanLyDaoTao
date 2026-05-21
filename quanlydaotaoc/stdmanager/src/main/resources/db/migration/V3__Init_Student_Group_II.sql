-- stdmanager/src/main/resources/db/migration/V3__Init_Student_Group_II.sql


-- ===================== GROUP 2 =======================
-- =====================================================


-- 1. Bảng student_classes: Danh sách lớp hành chính/lớp sinh hoạt
-- Cần tạo trước để bảng students có thể tham chiếu class_id
CREATE TABLE student_classes (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    class_code VARCHAR(20) NOT NULL UNIQUE, -- VD: CNTT-K20A
    class_name NVARCHAR(100) NOT NULL,
    course_year VARCHAR(20), -- Khóa học (VD: 2020)
    major_id UNIQUEIDENTIFIER, -- FK -> majors (Nhóm IV)
    department_id UNIQUEIDENTIFIER, -- FK -> departments (Nhóm III)
    advisor_id UNIQUEIDENTIFIER, -- Cố vấn học tập (FK -> employees)
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 2. Bảng students: Thông tin hồ sơ chi tiết của sinh viên
CREATE TABLE students (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- FK -> users.id (Nhóm I) 
    student_code VARCHAR(20) NOT NULL UNIQUE, -- 
    full_name NVARCHAR(100) NOT NULL, -- 
    date_of_birth DATE, -- 
    gender NVARCHAR(10), -- 1: Nam, 2: Nữ, 0: Khác 
    personal_identification_number VARCHAR(20), -- CMND/CCCD 
    date_of_issue DATE, -- 
    card_place NVARCHAR(100), -- 
    address NVARCHAR(300), -- Địa chỉ thường trú 
    current_address NVARCHAR(300), -- Địa chỉ hiện tại 
    department_id UNIQUEIDENTIFIER, -- FK -> khoa (Nhóm III)
    major_id UNIQUEIDENTIFIER, -- FK -> ngành (Nhóm IV)
    program_id UNIQUEIDENTIFIER, -- FK -> Chương trình đào tạo (Nhóm IV)
    status_id UNIQUEIDENTIFIER, -- Trạng thái hiện tại (Liên kết student_status)
    class_id UNIQUEIDENTIFIER, -- FK -> student_classes.id
    admission_year INT, -- Năm nhập học
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_Students_Users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_Students_Classes FOREIGN KEY (class_id) REFERENCES student_classes(id)
);
GO

-- 3. Bảng student_status: Lịch sử trạng thái sinh viên (đang học, bảo lưu, thôi học...)
CREATE TABLE student_status (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    student_id UNIQUEIDENTIFIER NOT NULL,
    status_code NVARCHAR(50),
    status_name NVARCHAR(100),
    start_date DATE,
    end_date DATE,
    description NVARCHAR(255),
    reason NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_StudentStatus_Students FOREIGN KEY (student_id) REFERENCES students(id)
);
GO