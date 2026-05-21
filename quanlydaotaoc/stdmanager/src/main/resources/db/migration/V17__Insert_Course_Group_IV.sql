-- stdmanager/src/main/resources/db/migration/V18__Insert_Course_Group_IV.sql

USE [stdmanager_db];
GO

-- ======================================================================
-- KHỞI TẠO DỮ LIỆU MẪU CHO NHÓM IV (HỌC PHẦN, CHƯƠNG TRÌNH & NGÀNH)
-- ======================================================================

-- Lấy ID của User Admin làm người tạo/cập nhật dữ liệu chuẩn
DECLARE @AdminUserId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @Dept_CNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');
DECLARE @Dept_KT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'KT');
DECLARE @Dept_NN UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'NN');

-- ======================================================================
-- 1. INSERT MAJORS (Ngành đào tạo)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'CNTT_KTPM')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CNTT_KTPM', N'Kỹ thuật Phần mềm', @Dept_CNTT, N'Chuyên ngành đào tạo kỹ sư phần mềm, lập trình ứng dụng', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'CNTT_MMT')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CNTT_MMT', N'Mạng máy tính & Truyền thông', @Dept_CNTT, N'Chuyên ngành về hạ tầng mạng, an ninh mạng và truyền thông', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'KT_QTKD')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'KT_QTKD', N'Quản trị Kinh doanh', @Dept_KT, N'Đào tạo nhân sự quản trị, điều hành doanh nghiệp', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'KT_KT')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'KT_KT', N'Kế toán', @Dept_KT, N'Đào tạo chuyên viên kế toán, kiểm toán và tài chính', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'NN_NNA')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'NN_NNA', N'Ngôn ngữ Anh', @Dept_NN, N'Đào tạo cử nhân ngoại ngữ chuyên ngành tiếng Anh', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 2. INSERT TRAINING_PROGRAMS (Chương trình đào tạo)
-- ======================================================================

DECLARE @Major_KTPM UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_KTPM');
DECLARE @Major_MMT UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_MMT');
DECLARE @Major_QTKD UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'KT_QTKD');
DECLARE @Major_NNA UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'NN_NNA');

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_KTPM_2022')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_KTPM_2022', N'Chương trình KTPM Khóa 2022', @Major_KTPM, 135, 4.5, N'Chương trình đào tạo kỹ sư KTPM theo chuẩn CDIO áp dụng từ khóa 2022', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_MMT_2022')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_MMT_2022', N'Chương trình MMT Khóa 2022', @Major_MMT, 138, 4.5, N'Chương trình đào tạo kỹ sư Mạng và An toàn thông tin', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_QTKD_2023')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_QTKD_2023', N'Chương trình QTKD Khóa 2023', @Major_QTKD, 120, 4, N'Chương trình cử nhân QTKD cập nhật theo chuẩn AACSB', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_NNA_2023')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_NNA_2023', N'Chương trình Ngôn ngữ Anh Khóa 2023', @Major_NNA, 125, 4, N'Chương trình cử nhân Ngôn ngữ Anh biên dịch - phiên dịch', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 3. INSERT COURSES (Học phần danh mục)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT1301')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT1301', N'Nhập môn Lập trình', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT1302')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT1302', N'Cấu trúc Dữ liệu & Giải thuật', 4, 45, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT2203')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT2203', N'Lập trình hướng đối tượng (Java)', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT3305')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT3305', N'Phát triển ứng dụng Web (Spring Boot)', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ECO1101')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'ECO1101', N'Kinh tế vĩ mô', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'MGT2201')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'MGT2201', N'Quản trị học đại cương', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ENG1101')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'ENG1101', N'Kỹ năng nghe nói tiếng Anh B1', 2, 15, 45, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'POL1001')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'POL1001', N'Triết học Mác - Lênin', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

GO