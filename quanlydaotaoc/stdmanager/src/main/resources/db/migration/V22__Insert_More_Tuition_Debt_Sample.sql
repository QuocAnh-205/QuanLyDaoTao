-- V22__Insert_More_Tuition_Debt_Sample.sql
-- Bổ sung dữ liệu mẫu phong phú cho module học phí: thêm nhiều sinh viên nợ
-- Chạy sau V21 để mở rộng dữ liệu test

USE [stdmanager_db];
GO

-- ======================================================================
-- BLOCK 1: Đảm bảo các định mức học phí đã tồn tại (upsert-safe)
-- ======================================================================

DECLARE @Prog_CNTT UNIQUEIDENTIFIER;
DECLARE @Prog_KT   UNIQUEIDENTIFIER;

SELECT @Prog_CNTT = tp.id
FROM training_programs tp JOIN majors m ON tp.major_id = m.id
WHERE m.major_code = 'CNTT_KTPM';

SELECT @Prog_KT = tp.id
FROM training_programs tp JOIN majors m ON tp.major_id = m.id
WHERE m.major_code = 'KT_QTKD';

-- K20 CNTT: 420k/TC
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE program_id = @Prog_CNTT AND course_year = 'K20')
    INSERT INTO tuition_fees (id, program_id, course_year, price_per_credit, base_tuition, effective_date, is_active, created_at, updated_at)
    VALUES (NEWID(), @Prog_CNTT, 'K20', 420000.00, 0.00, '2020-09-01', 1, GETDATE(), GETDATE());

-- K21 CNTT: 450k/TC
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE program_id = @Prog_CNTT AND course_year = 'K21')
    INSERT INTO tuition_fees (id, program_id, course_year, price_per_credit, base_tuition, effective_date, is_active, created_at, updated_at)
    VALUES (NEWID(), @Prog_CNTT, 'K21', 450000.00, 0.00, '2021-09-01', 1, GETDATE(), GETDATE());

-- K21 KT: 400k/TC + 200k cơ sở
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE program_id = @Prog_KT AND course_year = 'K21')
    INSERT INTO tuition_fees (id, program_id, course_year, price_per_credit, base_tuition, effective_date, is_active, created_at, updated_at)
    VALUES (NEWID(), @Prog_KT, 'K21', 400000.00, 200000.00, '2021-09-01', 1, GETDATE(), GETDATE());

GO

-- ======================================================================
-- BLOCK 2: Thêm 5 sinh viên mới để có thêm dữ liệu nợ test
-- ======================================================================

DECLARE @PassHash   NVARCHAR(255) = '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li';

DECLARE @Prog_CNTT2 UNIQUEIDENTIFIER;
DECLARE @Prog_KT2   UNIQUEIDENTIFIER;
DECLARE @Major_CNTT UNIQUEIDENTIFIER;
DECLARE @Major_KT   UNIQUEIDENTIFIER;
DECLARE @Dept_CNTT  UNIQUEIDENTIFIER;
DECLARE @Dept_KT    UNIQUEIDENTIFIER;
DECLARE @Class_CNTT20A UNIQUEIDENTIFIER;
DECLARE @Class_CNTT21A UNIQUEIDENTIFIER;
DECLARE @Class_KT21A   UNIQUEIDENTIFIER;

SELECT @Prog_CNTT2   = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'CNTT_KTPM';
SELECT @Prog_KT2     = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'KT_QTKD';
SELECT @Major_CNTT   = id FROM majors WHERE major_code = 'CNTT_KTPM';
SELECT @Major_KT     = id FROM majors WHERE major_code = 'KT_QTKD';
SELECT @Dept_CNTT    = id FROM departments WHERE code = 'CNTT';
SELECT @Dept_KT      = id FROM departments WHERE code = 'KT';
SELECT @Class_CNTT20A = id FROM student_classes WHERE class_code = 'CNTT-K20A';
SELECT @Class_CNTT21A = id FROM student_classes WHERE class_code = 'CNTT-K21A';
SELECT @Class_KT21A   = id FROM student_classes WHERE class_code = 'KT-K21A';

-- SV4: CNTT K20 - Lê Minh Tuấn
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20200004')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    VALUES (NEWID(), 'sv20200004', @PassHash, N'Lê Minh Tuấn', 'tuan.lm20200004@stdmanager.edu.vn', '0912345601', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20200004')
BEGIN
    DECLARE @UserId4 UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv20200004');
    DECLARE @StuId4  UNIQUEIDENTIFIER = NEWID();
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    VALUES (@StuId4, @UserId4, 'SV20200004', N'Lê Minh Tuấn', '2002-03-12', N'1', @Dept_CNTT, @Major_CNTT, @Prog_CNTT2, @Class_CNTT20A, 2020, 1, GETDATE(), GETDATE());

    IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20200004' AND r.code = 'SINHVIEN')
        INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
        SELECT NEWID(), @UserId4, r.id, 1, GETDATE(), GETDATE() FROM roles r WHERE r.code = 'SINHVIEN';
END

-- SV5: CNTT K21 - Phạm Thị Hà
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20210005')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    VALUES (NEWID(), 'sv20210005', @PassHash, N'Phạm Thị Hà', 'ha.pt20210005@stdmanager.edu.vn', '0912345602', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20210005')
BEGIN
    DECLARE @UserId5 UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv20210005');
    DECLARE @StuId5  UNIQUEIDENTIFIER = NEWID();
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    VALUES (@StuId5, @UserId5, 'SV20210005', N'Phạm Thị Hà', '2003-06-18', N'2', @Dept_CNTT, @Major_CNTT, @Prog_CNTT2, @Class_CNTT21A, 2021, 1, GETDATE(), GETDATE());

    IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20210005' AND r.code = 'SINHVIEN')
        INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
        SELECT NEWID(), @UserId5, r.id, 1, GETDATE(), GETDATE() FROM roles r WHERE r.code = 'SINHVIEN';
END

-- SV6: KT K21 - Trần Văn Bình  
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20210006')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    VALUES (NEWID(), 'sv20210006', @PassHash, N'Trần Văn Bình', 'binh.tv20210006@stdmanager.edu.vn', '0912345603', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20210006')
BEGIN
    DECLARE @UserId6 UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv20210006');
    DECLARE @StuId6  UNIQUEIDENTIFIER = NEWID();
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    VALUES (@StuId6, @UserId6, 'SV20210006', N'Trần Văn Bình', '2003-09-25', N'1', @Dept_KT, @Major_KT, @Prog_KT2, @Class_KT21A, 2021, 1, GETDATE(), GETDATE());

    IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20210006' AND r.code = 'SINHVIEN')
        INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
        SELECT NEWID(), @UserId6, r.id, 1, GETDATE(), GETDATE() FROM roles r WHERE r.code = 'SINHVIEN';
END

-- SV7: CNTT K20 - Nguyễn Thị Mai (quá hạn nợ)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20200007')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    VALUES (NEWID(), 'sv20200007', @PassHash, N'Nguyễn Thị Mai', 'mai.nt20200007@stdmanager.edu.vn', '0912345604', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20200007')
BEGIN
    DECLARE @UserId7 UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv20200007');
    DECLARE @StuId7  UNIQUEIDENTIFIER = NEWID();
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    VALUES (@StuId7, @UserId7, 'SV20200007', N'Nguyễn Thị Mai', '2002-11-05', N'2', @Dept_CNTT, @Major_CNTT, @Prog_CNTT2, @Class_CNTT20A, 2020, 1, GETDATE(), GETDATE());

    IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20200007' AND r.code = 'SINHVIEN')
        INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
        SELECT NEWID(), @UserId7, r.id, 1, GETDATE(), GETDATE() FROM roles r WHERE r.code = 'SINHVIEN';
END

-- SV8: KT K21 - Đỗ Thị Lan (học bổng cao)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20210008')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    VALUES (NEWID(), 'sv20210008', @PassHash, N'Đỗ Thị Lan', 'lan.dt20210008@stdmanager.edu.vn', '0912345605', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM students WHERE student_code = 'SV20210008')
BEGIN
    DECLARE @UserId8 UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv20210008');
    DECLARE @StuId8  UNIQUEIDENTIFIER = NEWID();
    INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
    VALUES (@StuId8, @UserId8, 'SV20210008', N'Đỗ Thị Lan', '2003-01-22', N'2', @Dept_KT, @Major_KT, @Prog_KT2, @Class_KT21A, 2021, 1, GETDATE(), GETDATE());

    IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'sv20210008' AND r.code = 'SINHVIEN')
        INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
        SELECT NEWID(), @UserId8, r.id, 1, GETDATE(), GETDATE() FROM roles r WHERE r.code = 'SINHVIEN';
END

GO

-- ======================================================================
-- BLOCK 3: Tạo bản ghi student_tuition với đủ loại trạng thái
-- ======================================================================

DECLARE @Sem_HK1_2425 UNIQUEIDENTIFIER;
DECLARE @Sem_HK2_2324 UNIQUEIDENTIFIER;

DECLARE @Fee_CNTT_K20 UNIQUEIDENTIFIER;
DECLARE @Fee_CNTT_K21 UNIQUEIDENTIFIER;
DECLARE @Fee_KT_K21   UNIQUEIDENTIFIER;

DECLARE @Prog_CNTT3 UNIQUEIDENTIFIER;
DECLARE @Prog_KT3   UNIQUEIDENTIFIER;

DECLARE @SV001 UNIQUEIDENTIFIER;
DECLARE @SV002 UNIQUEIDENTIFIER;
DECLARE @SV003 UNIQUEIDENTIFIER;
DECLARE @SV004 UNIQUEIDENTIFIER;
DECLARE @SV005 UNIQUEIDENTIFIER;
DECLARE @SV006 UNIQUEIDENTIFIER;
DECLARE @SV007 UNIQUEIDENTIFIER;
DECLARE @SV008 UNIQUEIDENTIFIER;

SELECT @Sem_HK1_2425 = id FROM semesters WHERE semester_code = 'HK1_2024_2025';
SELECT @Sem_HK2_2324 = id FROM semesters WHERE semester_code = 'HK2_2023_2024';

SELECT @Prog_CNTT3 = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'CNTT_KTPM';
SELECT @Prog_KT3   = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'KT_QTKD';

SELECT @Fee_CNTT_K20 = id FROM tuition_fees WHERE program_id = @Prog_CNTT3 AND course_year = 'K20' AND is_active = 1;
SELECT @Fee_CNTT_K21 = id FROM tuition_fees WHERE program_id = @Prog_CNTT3 AND course_year = 'K21' AND is_active = 1;
SELECT @Fee_KT_K21   = id FROM tuition_fees WHERE program_id = @Prog_KT3   AND course_year = 'K21' AND is_active = 1;

SELECT @SV001 = id FROM students WHERE student_code = 'SV20200001';
SELECT @SV002 = id FROM students WHERE student_code = 'SV20210002';
SELECT @SV003 = id FROM students WHERE student_code = 'SV20210003';
SELECT @SV004 = id FROM students WHERE student_code = 'SV20200004';
SELECT @SV005 = id FROM students WHERE student_code = 'SV20210005';
SELECT @SV006 = id FROM students WHERE student_code = 'SV20210006';
SELECT @SV007 = id FROM students WHERE student_code = 'SV20200007';
SELECT @SV008 = id FROM students WHERE student_code = 'SV20210008';

-- ── HK1_2024_2025 ──────────────────────────────────────────────────────

-- SV001: CNTT K20, 15TC, đã nộp 3tr → CÒN NỢ 3.3tr (status=2)
IF @SV001 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_CNTT_K20 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV001 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
BEGIN
    DECLARE @T1 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@T1, @SV001, @Sem_HK1_2425, @Fee_CNTT_K20, 15, 6300000.00, 0.00, 0.00, 6300000.00, 3000000.00, 3300000.00, 2, '2025-02-28', 1, GETDATE(), GETDATE());
    -- Lịch sử: đóng lần 1
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @T1, 3000000.00, '2024-10-15 09:30:00', 1, 'SUCCESS', N'VCB202410150001', N'Nộp học phí HK1 lần 1 (chuyển khoản)', 1, GETDATE(), GETDATE());
END

-- SV002: CNTT K21, 18TC, học bổng 1tr, chưa nộp → NỢ 7.1tr (status=3)
IF @SV002 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_CNTT_K21 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV002 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (NEWID(), @SV002, @Sem_HK1_2425, @Fee_CNTT_K21, 18, 8100000.00, 1000000.00, 0.00, 7100000.00, 0.00, 7100000.00, 3, '2025-02-28', 1, GETDATE(), GETDATE());

-- SV003: KT K21, 12TC, miễn giảm 500k, đã nộp đủ → ĐÃ HOÀN THÀNH (status=1)
IF @SV003 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_KT_K21 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV003 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
BEGIN
    DECLARE @T3 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@T3, @SV003, @Sem_HK1_2425, @Fee_KT_K21, 12, 5000000.00, 0.00, 500000.00, 4500000.00, 4500000.00, 0.00, 1, '2025-02-28', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @T3, 4500000.00, '2024-09-20 14:00:00', 2, 'SUCCESS', N'PM20240920001', N'Nộp đủ học phí HK1 (tiền mặt)', 1, GETDATE(), GETDATE());
END

-- SV004: CNTT K20, 16TC, chưa nộp → NỢ TOÀN BỘ 6.72tr (status=3)
IF @SV004 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_CNTT_K20 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV004 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (NEWID(), @SV004, @Sem_HK1_2425, @Fee_CNTT_K20, 16, 6720000.00, 0.00, 0.00, 6720000.00, 0.00, 6720000.00, 3, '2025-02-28', 1, GETDATE(), GETDATE());

-- SV005: CNTT K21, 20TC, đã nộp một phần 4tr → NỢ 5tr (status=2)
IF @SV005 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_CNTT_K21 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV005 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
BEGIN
    DECLARE @T5 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@T5, @SV005, @Sem_HK1_2425, @Fee_CNTT_K21, 20, 9000000.00, 0.00, 0.00, 9000000.00, 4000000.00, 5000000.00, 2, '2025-02-28', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @T5, 4000000.00, '2024-10-01 10:00:00', 3, 'SUCCESS', N'MOMO2024100100456', N'Nộp học phí HK1 qua MoMo lần 1', 1, GETDATE(), GETDATE());
END

-- SV006: KT K21, 15TC, chưa nộp → NỢ 6.2tr (status=3)
IF @SV006 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_KT_K21 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV006 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (NEWID(), @SV006, @Sem_HK1_2425, @Fee_KT_K21, 15, 6200000.00, 0.00, 0.00, 6200000.00, 0.00, 6200000.00, 3, '2025-02-28', 1, GETDATE(), GETDATE());

-- SV007: CNTT K20, 14TC, QUÁ HẠN (deadline cũ 2024-12-31) chưa nộp → OVERDUE (status=4)
IF @SV007 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_CNTT_K20 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV007 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (NEWID(), @SV007, @Sem_HK1_2425, @Fee_CNTT_K20, 14, 5880000.00, 0.00, 0.00, 5880000.00, 0.00, 5880000.00, 4, '2024-12-31', 1, GETDATE(), GETDATE());

-- SV008: KT K21, 18TC, học bổng 2tr, miễn giảm 500k, đã nộp đủ → ĐÃ HOÀN THÀNH (status=1)
-- rawAmount = 400k*18 + 200k = 7,400k; net = 7400-2000-500 = 4900k
IF @SV008 IS NOT NULL AND @Sem_HK1_2425 IS NOT NULL AND @Fee_KT_K21 IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV008 AND semester_id = @Sem_HK1_2425 AND is_active = 1)
BEGIN
    DECLARE @T8 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@T8, @SV008, @Sem_HK1_2425, @Fee_KT_K21, 18, 7400000.00, 2000000.00, 500000.00, 4900000.00, 4900000.00, 0.00, 1, '2025-02-28', 1, GETDATE(), GETDATE());
    -- Thanh toán 2 lần
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @T8, 2000000.00, '2024-09-15 08:00:00', 1, 'SUCCESS', N'MB2024091500789', N'Nộp học phí HK1 lần 1', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @T8, 2900000.00, '2024-10-05 11:00:00', 1, 'SUCCESS', N'MB2024100500890', N'Nộp học phí HK1 lần 2 (thanh toán hết)', 1, GETDATE(), GETDATE());
END

GO

-- ======================================================================
-- BLOCK 4: Một số bản ghi học kỳ trước (HK2_2023_2024) để xem lịch sử
-- ======================================================================

DECLARE @Sem_Old    UNIQUEIDENTIFIER;
DECLARE @SV_Old1    UNIQUEIDENTIFIER;
DECLARE @SV_Old2    UNIQUEIDENTIFIER;
DECLARE @SV_Old4    UNIQUEIDENTIFIER;
DECLARE @Fee_K20_Old UNIQUEIDENTIFIER;
DECLARE @Fee_K21_Old UNIQUEIDENTIFIER;
DECLARE @Prog_C     UNIQUEIDENTIFIER;

SELECT @Sem_Old = id FROM semesters WHERE semester_code = 'HK2_2023_2024';
SELECT @SV_Old1 = id FROM students WHERE student_code = 'SV20200001';
SELECT @SV_Old2 = id FROM students WHERE student_code = 'SV20210002';
SELECT @SV_Old4 = id FROM students WHERE student_code = 'SV20200004';
SELECT @Prog_C  = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'CNTT_KTPM';
SELECT @Fee_K20_Old = id FROM tuition_fees WHERE program_id = @Prog_C AND course_year = 'K20' AND is_active = 1;
SELECT @Fee_K21_Old = id FROM tuition_fees WHERE program_id = @Prog_C AND course_year = 'K21' AND is_active = 1;

-- SV001 HK cũ - đã nộp đủ
IF @SV_Old1 IS NOT NULL AND @Sem_Old IS NOT NULL AND @Fee_K20_Old IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV_Old1 AND semester_id = @Sem_Old AND is_active = 1)
BEGIN
    DECLARE @P1 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@P1, @SV_Old1, @Sem_Old, @Fee_K20_Old, 14, 5880000.00, 0.00, 0.00, 5880000.00, 5880000.00, 0.00, 1, '2024-04-30', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @P1, 5880000.00, '2024-03-01 10:00:00', 2, 'SUCCESS', N'PM20240301HK2', N'Nộp học phí HK2 2023-2024 tiền mặt', 1, GETDATE(), GETDATE());
END

-- SV002 HK cũ - đã nộp đủ (2 lần)
IF @SV_Old2 IS NOT NULL AND @Sem_Old IS NOT NULL AND @Fee_K21_Old IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV_Old2 AND semester_id = @Sem_Old AND is_active = 1)
BEGIN
    DECLARE @P2 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@P2, @SV_Old2, @Sem_Old, @Fee_K21_Old, 16, 7200000.00, 1500000.00, 0.00, 5700000.00, 5700000.00, 0.00, 1, '2024-04-30', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @P2, 2700000.00, '2024-02-25 14:20:00', 1, 'SUCCESS', N'MB2024022500098765', N'HK2 lần 1 - MB Bank', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @P2, 3000000.00, '2024-03-10 09:15:00', 3, 'SUCCESS', N'MOMO2024031000345', N'HK2 lần 2 - MoMo', 1, GETDATE(), GETDATE());
END

-- SV004 HK cũ - đã nộp đủ
IF @SV_Old4 IS NOT NULL AND @Sem_Old IS NOT NULL AND @Fee_K20_Old IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV_Old4 AND semester_id = @Sem_Old AND is_active = 1)
BEGIN
    DECLARE @P4 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@P4, @SV_Old4, @Sem_Old, @Fee_K20_Old, 15, 6300000.00, 0.00, 0.00, 6300000.00, 6300000.00, 0.00, 1, '2024-04-30', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @P4, 3000000.00, '2024-02-20 08:30:00', 1, 'SUCCESS', N'VCB20240220004', N'Nộp lần 1', 1, GETDATE(), GETDATE());
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @P4, 3300000.00, '2024-03-15 16:00:00', 1, 'SUCCESS', N'VCB20240315004', N'Nộp lần 2 - thanh toán hết', 1, GETDATE(), GETDATE());
END

GO
