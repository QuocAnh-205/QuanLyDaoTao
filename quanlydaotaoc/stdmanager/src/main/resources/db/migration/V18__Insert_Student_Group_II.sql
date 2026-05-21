-- stdmanager/src/main/resources/db/migration/V18__Insert_Student_Group_II.sql

USE stdmanager_db;

-- ======================================================================
-- KHỞI TẠO DỮ LIỆU MẪU CHO NHÓM II (SINH VIÊN / LỚP HÀNH CHÍNH)
-- ======================================================================

-- Bảng tạm để lưu ID vừa tạo, phục vụ ánh xạ Khóa ngoại
DECLARE @GeneratedUsers TABLE (username VARCHAR(50), user_id UNIQUEIDENTIFIER, full_name NVARCHAR(100));
DECLARE @GeneratedClasses TABLE (class_code VARCHAR(20), class_id UNIQUEIDENTIFIER);
DECLARE @GeneratedStudents TABLE (student_code VARCHAR(20), student_id UNIQUEIDENTIFIER, user_id UNIQUEIDENTIFIER);

-- Lấy dữ liệu nền tảng từ các Group trước (Cần đảm bảo V17 đã chạy - Ngành/Chương trình)
DECLARE @Dept_CNTT UNIQUEIDENTIFIER;
DECLARE @Dept_KT UNIQUEIDENTIFIER;
DECLARE @Major_CNTT UNIQUEIDENTIFIER;
DECLARE @Major_KT UNIQUEIDENTIFIER;
DECLARE @Program_CNTT UNIQUEIDENTIFIER;
DECLARE @Program_KT UNIQUEIDENTIFIER;
DECLARE @Advisor_GV001 UNIQUEIDENTIFIER;

SET @Dept_CNTT = (SELECT id FROM departments WHERE code = 'CNTT');
SET @Dept_KT = (SELECT id FROM departments WHERE code = 'KT');
-- Chú ý: major_code đã được chuẩn hóa ở V17
SET @Major_CNTT = (SELECT id FROM majors WHERE major_code = 'CNTT_KTPM');
SET @Major_KT = (SELECT id FROM majors WHERE major_code = 'KT_QTKD');
SET @Program_CNTT = (SELECT TOP 1 id FROM training_programs WHERE major_id = @Major_CNTT);
SET @Program_KT = (SELECT TOP 1 id FROM training_programs WHERE major_id = @Major_KT);
SET @Advisor_GV001 = (SELECT id FROM employees WHERE employee_code = 'GV001');

-- ======================================================================
-- 1. INSERT STUDENT_CLASSES (Lớp hành chính / Lớp sinh hoạt)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM student_classes WHERE class_code = 'CNTT-K20A')
    INSERT INTO student_classes (id, class_code, class_name, course_year, major_id, department_id, advisor_id, is_active, created_at, updated_at)
    OUTPUT INSERTED.class_code, INSERTED.id INTO @GeneratedClasses
    VALUES (NEWID(), 'CNTT-K20A', N'Công nghệ Thông tin K20A', '2020', @Major_CNTT, @Dept_CNTT, @Advisor_GV001, 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedClasses (class_code, class_id) SELECT class_code, id FROM student_classes WHERE class_code = 'CNTT-K20A';

IF NOT EXISTS (SELECT 1 FROM student_classes WHERE class_code = 'CNTT-K21A')
    INSERT INTO student_classes (id, class_code, class_name, course_year, major_id, department_id, advisor_id, is_active, created_at, updated_at)
    OUTPUT INSERTED.class_code, INSERTED.id INTO @GeneratedClasses
    VALUES (NEWID(), 'CNTT-K21A', N'Công nghệ Thông tin K21A', '2021', @Major_CNTT, @Dept_CNTT, @Advisor_GV001, 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedClasses (class_code, class_id) SELECT class_code, id FROM student_classes WHERE class_code = 'CNTT-K21A';

IF NOT EXISTS (SELECT 1 FROM student_classes WHERE class_code = 'KT-K21A')
    INSERT INTO student_classes (id, class_code, class_name, course_year, major_id, department_id, advisor_id, is_active, created_at, updated_at)
    OUTPUT INSERTED.class_code, INSERTED.id INTO @GeneratedClasses
    VALUES (NEWID(), 'KT-K21A', N'Quản trị Kinh doanh K21A', '2021', @Major_KT, @Dept_KT, NULL, 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedClasses (class_code, class_id) SELECT class_code, id FROM student_classes WHERE class_code = 'KT-K21A';

-- ======================================================================
-- 2. INSERT USERS & STUDENTS (Tài khoản và Hồ sơ Sinh viên)
-- ======================================================================
DECLARE @PassHash NVARCHAR(255) = '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li';

DECLARE @Class_CNTT20A UNIQUEIDENTIFIER = (SELECT class_id FROM @GeneratedClasses WHERE class_code = 'CNTT-K20A');
DECLARE @Class_CNTT21A UNIQUEIDENTIFIER = (SELECT class_id FROM @GeneratedClasses WHERE class_code = 'CNTT-K21A');
DECLARE @Class_KT21A UNIQUEIDENTIFIER = (SELECT class_id FROM @GeneratedClasses WHERE class_code = 'KT-K21A');

-- 2.1 Tạo User cho SV
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20200001')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20200001', @PassHash, N'Nguyễn Đi Học', 'duc.pm20200001@stdmanager.edu.vn', '0987654321', '/avatars/duc.jpg', GETDATE(), 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name) SELECT username, id, full_name FROM users WHERE username = 'sv20200001';

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20210002')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20210002', @PassHash, N'Đặng Đi Chơi', 'hanh.nt20210002@stdmanager.edu.vn', '0987654322', '/avatars/hanh.jpg', NULL, 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name) SELECT username, id, full_name FROM users WHERE username = 'sv20210002';

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20210003')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20210003', @PassHash, N'Nguyễn Bỏ Học', 'khanh.tq20210003@stdmanager.edu.vn', '0987654323', '/avatars/khanh.jpg', GETDATE(), 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name) SELECT username, id, full_name FROM users WHERE username = 'sv20210003';

-- 2.2 Tạo Student và map với User
IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20200001')
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, personal_identification_number, date_of_issue, card_place, address, current_address, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
    SELECT NEWID(), user_id, 'SV20200001', full_name, '2002-04-15', N'1', '001202005487', '2020-06-15', N'Công an TP. Hà Nội', N'Số 5, Lê Thanh Nghị, Hà Nội', N'Ký túc xá khu B', @Dept_CNTT, @Major_CNTT, @Program_CNTT, @Class_CNTT20A, 2020, 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'sv20200001';
ELSE
    INSERT INTO @GeneratedStudents (student_code, student_id, user_id) SELECT student_code, id, user_id FROM students WHERE student_code = 'SV20200001';

IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20210002')
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, personal_identification_number, date_of_issue, card_place, address, current_address, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
    SELECT NEWID(), user_id, 'SV20210002', full_name, '2003-11-20', N'2', '002202102345', '2021-07-20', N'Công an TP. HCM', N'123 Nguyễn Văn Cừ, HCM', N'123 Nguyễn Văn Cừ, HCM', @Dept_CNTT, @Major_CNTT, @Program_CNTT, @Class_CNTT21A, 2021, 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'sv20210002';
ELSE
    INSERT INTO @GeneratedStudents (student_code, student_id, user_id) SELECT student_code, id, user_id FROM students WHERE student_code = 'SV20210002';

IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20210003')
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, personal_identification_number, date_of_issue, card_place, address, current_address, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
    SELECT NEWID(), user_id, 'SV20210003', full_name, '2003-07-08', N'1', '001202107891', '2021-07-25', N'Công an Bắc Ninh', N'Thị trấn Từ Sơn, Bắc Ninh', N'Phòng trọ số 5', @Dept_KT, @Major_KT, @Program_KT, @Class_KT21A, 2021, 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'sv20210003';
ELSE
    INSERT INTO @GeneratedStudents (student_code, student_id, user_id) SELECT student_code, id, user_id FROM students WHERE student_code = 'SV20210003';

-- ======================================================================
-- 3. INSERT STUDENT_STATUS (Lịch sử trạng thái sinh viên)
-- ======================================================================

DECLARE @Stu_SV20200001 UNIQUEIDENTIFIER = (SELECT student_id FROM @GeneratedStudents WHERE student_code = 'SV20200001');
DECLARE @Stu_SV20210002 UNIQUEIDENTIFIER = (SELECT student_id FROM @GeneratedStudents WHERE student_code = 'SV20210002');
DECLARE @Stu_SV20210003 UNIQUEIDENTIFIER = (SELECT student_id FROM @GeneratedStudents WHERE student_code = 'SV20210003');

-- Bổ sung trạng thái và Cập nhật ngược lại bảng students.status_id để hiển thị ở List
DECLARE @StatusId UNIQUEIDENTIFIER;

IF NOT EXISTS (SELECT 1 FROM student_status WHERE student_id = @Stu_SV20200001)
BEGIN
    SET @StatusId = NEWID();
    INSERT INTO student_status (id, student_id, status_code, status_name, start_date, is_active, created_at, updated_at)
    VALUES (@StatusId, @Stu_SV20200001, 'STUDYING', N'Đang học', '2020-09-01', 1, GETDATE(), GETDATE());
    UPDATE students SET status_id = @StatusId WHERE id = @Stu_SV20200001;
END

IF NOT EXISTS (SELECT 1 FROM student_status WHERE student_id = @Stu_SV20210002 AND status_code = 'RESERVED')
    INSERT INTO student_status (id, student_id, status_code, status_name, start_date, end_date, reason, is_active, created_at, updated_at)
    VALUES (NEWID(), @Stu_SV20210002, 'RESERVED', N'Bảo lưu', '2022-09-01', '2023-08-31', N'Lý do cá nhân', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM student_status WHERE student_id = @Stu_SV20210002 AND status_code = 'STUDYING')
BEGIN
    SET @StatusId = NEWID();
    INSERT INTO student_status (id, student_id, status_code, status_name, start_date, is_active, created_at, updated_at)
    VALUES (@StatusId, @Stu_SV20210002, 'STUDYING', N'Đang học', '2023-09-01', 1, GETDATE(), GETDATE());
    UPDATE students SET status_id = @StatusId WHERE id = @Stu_SV20210002;
END

IF NOT EXISTS (SELECT 1 FROM student_status WHERE student_id = @Stu_SV20210003)
BEGIN
    SET @StatusId = NEWID();
    INSERT INTO student_status (id, student_id, status_code, status_name, start_date, is_active, created_at, updated_at)
    VALUES (@StatusId, @Stu_SV20210003, 'STUDYING', N'Đang học', '2021-09-01', 1, GETDATE(), GETDATE());
    UPDATE students SET status_id = @StatusId WHERE id = @Stu_SV20210003;
END

-- Gán role SINHVIEN cho user
IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20200001' AND r.code = 'SINHVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'sv20200001' AND r.code = 'SINHVIEN';

IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20210002' AND r.code = 'SINHVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'sv20210002' AND r.code = 'SINHVIEN';

IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20210003' AND r.code = 'SINHVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'sv20210003' AND r.code = 'SINHVIEN';