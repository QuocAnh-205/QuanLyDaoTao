-- stdmanager/src/main/resources/db/migration/V2__Init_Lecturer_Group_III.sql


-- 1. Bảng departments: Khoa / Viện / Phòng ban quản lý 
CREATE TABLE departments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code VARCHAR(10) NOT NULL UNIQUE, -- Mã khoa 
    name NVARCHAR(100) NOT NULL, -- Tên khoa / viện 
    description NVARCHAR(255), -- Mô tả 
    established_year INT, -- Năm thành lập 
    created_at DATETIME2 DEFAULT GETDATE(), -- 
    updated_at DATETIME2, -- 
    created_by UNIQUEIDENTIFIER, -- 
    updated_by UNIQUEIDENTIFIER, -- 
    deleted_at DATETIME2, -- 
    deleted_by UNIQUEIDENTIFIER, -- 
    is_active BIT DEFAULT 1 -- 
);
GO

-- 2. Bảng positions: Định nghĩa chức danh/vị trí công tác
CREATE TABLE positions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code VARCHAR(10) NOT NULL UNIQUE, -- Mã chức danh
    name NVARCHAR(50) NOT NULL, -- Tên chức danh
    level INT, -- Thứ bậc học thuật
    description NVARCHAR(255), -- Mô tả
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1 --
);
GO

-- 3. Bảng employees: Thông tin giảng viên/nhân viên/giáo vụ 8]
CREATE TABLE employees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- Tài khoản đăng nhập (FK -> users.id) 8]
    employee_code VARCHAR(20) NOT NULL UNIQUE, -- Mã nhân viên 
    full_name NVARCHAR(100) NOT NULL, -- Họ tên 
    date_of_birth DATE, -- Ngày sinh 
    gender NVARCHAR(10), -- Giới tính (1: Nam, 2: Nữ, 0: Khác) 
    email NVARCHAR(100), -- Email 
    phone VARCHAR(20), -- Số điện thoại 
    address NVARCHAR(255), -- Địa chỉ 
    department_id UNIQUEIDENTIFIER, -- Phòng ban / khoa (FK -> departments.id) 
    position_id UNIQUEIDENTIFIER, -- Chức danh (FK -> positions.id)
    hire_date DATE, -- Ngày tuyển dụng 
    contract_type NVARCHAR(255), -- Loại hợp đồng 
    salary_coefficient DECIMAL(4,2), -- Hệ số lương 
    academic_degree NVARCHAR(50), -- Học vị (ThS, TS) 
    academic_title NVARCHAR(50), -- Học hàm (GS, PGS) 
    specialization NVARCHAR(255), -- Chuyên môn 
    created_at DATETIME2 DEFAULT GETDATE(), -- 
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Employees_Users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_Employees_Departments FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT FK_Employees_Positions FOREIGN KEY (position_id) REFERENCES positions(id)
);
GO

-- 4. Bảng lecturer_degrees: Bằng cấp giảng viên 
CREATE TABLE lecturer_degrees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên (FK -> employees.id)
    degree NVARCHAR(50), -- Học vị
    major NVARCHAR(100), -- Chuyên ngành
    university NVARCHAR(150), -- Trường đào tạo
    graduation_year INT, -- Năm tốt nghiệp
    is_highest BIT DEFAULT 0, -- Học vị cao nhất
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Degrees_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO

-- 5. Bảng lecturer_positions_history: Lịch sử chức danh
CREATE TABLE lecturer_positions_history (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên
    position_id UNIQUEIDENTIFIER NOT NULL, -- Chức danh
    start_date DATE, -- Ngày bắt đầu
    end_date DATE, -- Ngày kết thúc
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_History_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id),
    CONSTRAINT FK_History_Positions FOREIGN KEY (position_id) REFERENCES positions(id)
);
GO

-- 6. Bảng contracts: Thông tin hợp đồng lao động
CREATE TABLE contracts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên
    contract_type NVARCHAR(50), -- Loại hợp đồng
    start_date DATE, -- Ngày bắt đầu
    end_date DATE, -- Ngày kết thúc
    salary_coefficient DECIMAL(5,2), -- Hệ số lương
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Contracts_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO

-- 7. Bảng lecturer_specializations: Chuyên môn sâu
CREATE TABLE lecturer_specializations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên
    specialization NVARCHAR(100), -- Chuyên môn
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Specializations_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO