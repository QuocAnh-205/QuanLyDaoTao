-- stdmanager/src/main/resources/db/migration/V1__Init_Auth_Group_I.sql

USE stdmanager_db;
GO

DELETE FROM flyway_schema_history WHERE success = 0;

-- 2. Bảng roles: Định nghĩa vai trò (ADMIN, GIAOVU, GIANGVIEN, SINHVIEN)
CREATE TABLE roles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code NVARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    is_system BIT DEFAULT 0, -- Vai trò hệ thống không được xóa [cite: 3]
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 3. Bảng users: Lưu thông tin tài khoản đăng nhập
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    username NVARCHAR(50) NOT NULL UNIQUE, -- 
    password_hash NVARCHAR(255) NOT NULL, -- 
    full_name NVARCHAR(100), -- 
    email NVARCHAR(100),
    phone NVARCHAR(20),
    avatar_url NVARCHAR(255),
    last_login_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 4. Bảng user_roles: Bảng trung gian gán vai trò cho người dùng
CREATE TABLE user_roles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (role_id) REFERENCES roles(id)
);
GO

-- 5. Bảng permissions: Lưu danh sách quyền chi tiết (STUDENT, COURSE, GRADE, ...)
CREATE TABLE permissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code NVARCHAR(100) NOT NULL UNIQUE,
    name NVARCHAR(150) NOT NULL,
    module NVARCHAR(100), -- Nhóm chức năng [cite: 4]
    description NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 6. Bảng role_permissions: Gán quyền chi tiết cho từng vai trò
CREATE TABLE role_permissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    role_id UNIQUEIDENTIFIER NOT NULL,
    permission_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_RolePermissions_Roles FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
GO