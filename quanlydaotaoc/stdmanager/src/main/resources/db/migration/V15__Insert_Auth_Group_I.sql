-- stdmanager/src/main/resources/db/migration/V15__Insert_Auth_Group_I.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. INSERT ROLES (4 vai trò hệ thống)
-- ======================================================================
-- Sử dụng NEWID() để tạo các UUID tĩnh nhằm đảm bảo tính toàn vẹn FK ở các bước sau

IF NOT EXISTS (SELECT 1 FROM roles WHERE code = 'ADMIN')
BEGIN
    INSERT INTO roles (id, code, name, description, is_system, is_active, created_at, updated_at)
    VALUES (NEWID(), 'ADMIN', N'Quản trị viên hệ thống', N'Có toàn quyền quản trị hệ thống, cấu hình và phân quyền', 1, 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM roles WHERE code = 'GIAOVU')
BEGIN
    INSERT INTO roles (id, code, name, description, is_system, is_active, created_at, updated_at)
    VALUES (NEWID(), 'GIAOVU', N'Nhân viên Giáo vụ', N'Quản lý đào tạo, lịch học, đăng ký tín chỉ và khảo thí', 1, 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM roles WHERE code = 'GIANGVIEN')
BEGIN
    INSERT INTO roles (id, code, name, description, is_system, is_active, created_at, updated_at)
    VALUES (NEWID(), 'GIANGVIEN', N'Giảng viên', N'Quản lý lớp học phần, nhập điểm và tra cứu thông tin giảng dạy', 1, 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM roles WHERE code = 'SINHVIEN')
BEGIN
    INSERT INTO roles (id, code, name, description, is_system, is_active, created_at, updated_at)
    VALUES (NEWID(), 'SINHVIEN', N'Sinh viên', N'Đăng ký tín chỉ, tra cứu điểm, lịch học và học phí', 1, 1, GETDATE(), GETDATE());
END
GO

-- ======================================================================
-- 2. INSERT PERMISSIONS (Phân quyền chi tiết theo module)
-- ======================================================================

-- User Management
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'USER_CREATE')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'USER_CREATE', N'Tạo người dùng', N'USER', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'USER_READ')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'USER_READ', N'Xem người dùng', N'USER', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'USER_UPDATE')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'USER_UPDATE', N'Cập nhật người dùng', N'USER', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'USER_DELETE')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'USER_DELETE', N'Xóa người dùng', N'USER', 1, GETDATE(), GETDATE());

-- Student Management
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'STUDENT_CREATE')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'STUDENT_CREATE', N'Tạo hồ sơ sinh viên', N'STUDENT', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'STUDENT_READ')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'STUDENT_READ', N'Xem hồ sơ sinh viên', N'STUDENT', 1, GETDATE(), GETDATE());

-- Course & Program Management
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'COURSE_MANAGE')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'COURSE_MANAGE', N'Quản lý học phần & chương trình', N'COURSE', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'COURSE_READ')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'COURSE_READ', N'Xem học phần', N'COURSE', 1, GETDATE(), GETDATE());

-- Registration Management
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'REGISTRATION_MANAGE')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'REGISTRATION_MANAGE', N'Quản lý đợt đăng ký', N'REGISTRATION', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'REGISTRATION_REGISTER')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'REGISTRATION_REGISTER', N'Đăng ký tín chỉ', N'REGISTRATION', 1, GETDATE(), GETDATE());

-- Grade Management
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'GRADE_INPUT')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'GRADE_INPUT', N'Nhập điểm', N'GRADE', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'GRADE_READ')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'GRADE_READ', N'Xem điểm', N'GRADE', 1, GETDATE(), GETDATE());

-- Finance Management
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'FINANCE_MANAGE')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'FINANCE_MANAGE', N'Quản lý tài chính/học phí', N'FINANCE', 1, GETDATE(), GETDATE());
IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'FINANCE_READ')
    INSERT INTO permissions (id, code, name, module, is_active, created_at, updated_at) VALUES (NEWID(), 'FINANCE_READ', N'Xem học phí/công nợ', N'FINANCE', 1, GETDATE(), GETDATE());
GO

-- ======================================================================
-- 3. INSERT USERS (Tài khoản mặc định của hệ thống)
-- ======================================================================
-- Mật khẩu mặc định (VD): Admin@123 (Đã hash bằng BCrypt)
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

DECLARE @PassHash NVARCHAR(255) = '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li';

DECLARE @AdminUserId UNIQUEIDENTIFIER = NEWID();
DECLARE @GiaovuUserId UNIQUEIDENTIFIER = NEWID();

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
BEGIN
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    VALUES (@AdminUserId, 'admin', @PassHash, N'System Administrator', 'admin@stdmanager.edu.vn', '0900000000', 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'giaovu')
BEGIN
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    VALUES (@GiaovuUserId, 'giaovu', @PassHash, N'Nhân viên Giáo vụ', 'giaovu@stdmanager.edu.vn', '0900000001', 1, GETDATE(), GETDATE());
END
GO

-- ======================================================================
-- 4. INSERT USER_ROLES (Gán vai trò cho User)
-- ======================================================================

-- Gán role ADMIN cho user admin
IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'admin' AND r.code = 'ADMIN')
BEGIN
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE()
    FROM users u CROSS JOIN roles r
    WHERE u.username = 'admin' AND r.code = 'ADMIN';
END

-- Gán role GIAOVU cho user giaovu
IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'giaovu' AND r.code = 'GIAOVU')
BEGIN
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE()
    FROM users u CROSS JOIN roles r
    WHERE u.username = 'giaovu' AND r.code = 'GIAOVU';
END
GO

-- ======================================================================
-- 5. INSERT ROLE_PERMISSIONS (Gán quyền chi tiết cho từng Role)
-- ======================================================================

-- 5.1 ADMIN: Có MỌI QUYỀN (All Permissions)
INSERT INTO role_permissions (id, role_id, permission_id, is_active, created_at, updated_at)
SELECT NEWID(), r.id, p.id, 1, GETDATE(), GETDATE()
FROM roles r CROSS JOIN permissions p
WHERE r.code = 'ADMIN'
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);
GO

-- 5.2 GIAOVU: Toàn quyền Student, Course, Registration, Grade, Finance (Trừ User Management)
INSERT INTO role_permissions (id, role_id, permission_id, is_active, created_at, updated_at)
SELECT NEWID(), r.id, p.id, 1, GETDATE(), GETDATE()
FROM roles r CROSS JOIN permissions p
WHERE r.code = 'GIAOVU' 
AND p.module IN ('STUDENT', 'COURSE', 'REGISTRATION', 'GRADE', 'FINANCE')
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);
GO

-- 5.3 GIANGVIEN: Xem khóa học, Nhập điểm, Xem điểm
INSERT INTO role_permissions (id, role_id, permission_id, is_active, created_at, updated_at)
SELECT NEWID(), r.id, p.id, 1, GETDATE(), GETDATE()
FROM roles r CROSS JOIN permissions p
WHERE r.code = 'GIANGVIEN' 
AND p.code IN ('COURSE_READ', 'GRADE_INPUT', 'GRADE_READ')
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);
GO

-- 5.4 SINHVIEN: Đăng ký tín chỉ, Xem điểm, Xem học phí
INSERT INTO role_permissions (id, role_id, permission_id, is_active, created_at, updated_at)
SELECT NEWID(), r.id, p.id, 1, GETDATE(), GETDATE()
FROM roles r CROSS JOIN permissions p
WHERE r.code = 'SINHVIEN' 
AND p.code IN ('COURSE_READ', 'REGISTRATION_REGISTER', 'GRADE_READ', 'FINANCE_READ')
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);
GO