-- V21__Insert_Tuition_Sample_Data.sql
-- Dữ liệu mẫu cho module quản lý học phí

USE [stdmanager_db];
GO

-- ======================================================================
-- 1. ĐỊNH MỨC HỌC PHÍ (tuition_fees)
-- ======================================================================

DECLARE @Program_CNTT UNIQUEIDENTIFIER;
DECLARE @Program_KT   UNIQUEIDENTIFIER;

SELECT @Program_CNTT = tp.id 
FROM training_programs tp 
JOIN majors m ON tp.major_id = m.id 
WHERE m.major_code = 'CNTT_KTPM';

SELECT @Program_KT = tp.id 
FROM training_programs tp 
JOIN majors m ON tp.major_id = m.id 
WHERE m.major_code = 'KT_QTKD';

-- Định mức cho ngành CNTT - Khóa 2020
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE program_id = @Program_CNTT AND course_year = 'K20')
    INSERT INTO tuition_fees (id, program_id, course_year, price_per_credit, base_tuition, effective_date, is_active, created_at, updated_at)
    VALUES (NEWID(), @Program_CNTT, 'K20', 420000.00, 0.00, '2020-09-01', 1, GETDATE(), GETDATE());

-- Định mức cho ngành CNTT - Khóa 2021
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE program_id = @Program_CNTT AND course_year = 'K21')
    INSERT INTO tuition_fees (id, program_id, course_year, price_per_credit, base_tuition, effective_date, is_active, created_at, updated_at)
    VALUES (NEWID(), @Program_CNTT, 'K21', 450000.00, 0.00, '2021-09-01', 1, GETDATE(), GETDATE());

-- Định mức cho ngành Kinh tế - Khóa 2021
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE program_id = @Program_KT AND course_year = 'K21')
    INSERT INTO tuition_fees (id, program_id, course_year, price_per_credit, base_tuition, effective_date, is_active, created_at, updated_at)
    VALUES (NEWID(), @Program_KT, 'K21', 400000.00, 200000.00, '2021-09-01', 1, GETDATE(), GETDATE());

GO

-- ======================================================================
-- 2. CÔNG NỢ HỌC PHÍ MẪU (student_tuition) cho HK1_2024_2025
-- ======================================================================

DECLARE @Semester_HK1_2425  UNIQUEIDENTIFIER;
DECLARE @Semester_HK2_2324  UNIQUEIDENTIFIER;
DECLARE @Student_SV20200001 UNIQUEIDENTIFIER;
DECLARE @Student_SV20210002 UNIQUEIDENTIFIER;
DECLARE @Student_SV20210003 UNIQUEIDENTIFIER;
DECLARE @Fee_CNTT_K20       UNIQUEIDENTIFIER;
DECLARE @Fee_CNTT_K21       UNIQUEIDENTIFIER;
DECLARE @Fee_KT_K21         UNIQUEIDENTIFIER;
DECLARE @Program_CNTT_2     UNIQUEIDENTIFIER;
DECLARE @Program_KT_2       UNIQUEIDENTIFIER;

SELECT @Semester_HK1_2425  = id FROM semesters WHERE semester_code = 'HK1_2024_2025';
SELECT @Semester_HK2_2324  = id FROM semesters WHERE semester_code = 'HK2_2023_2024';
SELECT @Student_SV20200001 = id FROM students WHERE student_code = 'SV20200001';
SELECT @Student_SV20210002 = id FROM students WHERE student_code = 'SV20210002';
SELECT @Student_SV20210003 = id FROM students WHERE student_code = 'SV20210003';

SELECT @Program_CNTT_2 = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'CNTT_KTPM';
SELECT @Program_KT_2   = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'KT_QTKD';

SELECT @Fee_CNTT_K20 = id FROM tuition_fees WHERE program_id = @Program_CNTT_2 AND course_year = 'K20' AND is_active = 1;
SELECT @Fee_CNTT_K21 = id FROM tuition_fees WHERE program_id = @Program_CNTT_2 AND course_year = 'K21' AND is_active = 1;
SELECT @Fee_KT_K21   = id FROM tuition_fees WHERE program_id = @Program_KT_2   AND course_year = 'K21' AND is_active = 1;

-- SV20200001: CNTT K20, 15 tín chỉ, đã nộp một phần (HK1_2024_2025)
-- 420,000 * 15 = 6,300,000 rawAmount; nộp 3,000,000 rồi; còn nợ 3,300,000
IF @Student_SV20200001 IS NOT NULL AND @Semester_HK1_2425 IS NOT NULL AND @Fee_CNTT_K20 IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Student_SV20200001 AND semester_id = @Semester_HK1_2425)
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (NEWID(), @Student_SV20200001, @Semester_HK1_2425, @Fee_CNTT_K20,
            15, 6300000.00, 0.00, 0.00, 6300000.00, 3000000.00, 3300000.00, 2, '2025-02-28', 1, GETDATE(), GETDATE());

-- SV20210002: CNTT K21, 18 tín chỉ, học bổng 1,000,000, chưa nộp (HK1_2024_2025)
-- 450,000 * 18 = 8,100,000 rawAmount; HB 1,000,000; net = 7,100,000; chưa nộp => DEBT
IF @Student_SV20210002 IS NOT NULL AND @Semester_HK1_2425 IS NOT NULL AND @Fee_CNTT_K21 IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Student_SV20210002 AND semester_id = @Semester_HK1_2425)
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (NEWID(), @Student_SV20210002, @Semester_HK1_2425, @Fee_CNTT_K21,
            18, 8100000.00, 1000000.00, 0.00, 7100000.00, 0.00, 7100000.00, 3, '2025-02-28', 1, GETDATE(), GETDATE());

-- SV20210003: KT K21, 12 tín chỉ, đã nộp đầy đủ (HK1_2024_2025)
-- 400,000 * 12 + 200,000 = 5,000,000 rawAmount; đã nộp đủ => PAID
IF @Student_SV20210003 IS NOT NULL AND @Semester_HK1_2425 IS NOT NULL AND @Fee_KT_K21 IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Student_SV20210003 AND semester_id = @Semester_HK1_2425)
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (NEWID(), @Student_SV20210003, @Semester_HK1_2425, @Fee_KT_K21,
            12, 5000000.00, 0.00, 500000.00, 4500000.00, 4500000.00, 0.00, 1, '2025-02-28', 1, GETDATE(), GETDATE());

GO

-- ======================================================================
-- 3. LỊCH SỬ THANH TOÁN (payments) - cho SV20200001 đã nộp 1 lần
-- ======================================================================

DECLARE @Tuition_SV001_HK1 UNIQUEIDENTIFIER;

SELECT @Tuition_SV001_HK1 = st.id 
FROM student_tuition st 
JOIN students sv ON st.student_id = sv.id
JOIN semesters sem ON st.semester_id = sem.id
WHERE sv.student_code = 'SV20200001' AND sem.semester_code = 'HK1_2024_2025';

-- Ghi nhận lần đóng tiền đầu của SV20200001
IF @Tuition_SV001_HK1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments WHERE tuition_id = @Tuition_SV001_HK1)
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @Tuition_SV001_HK1, 3000000.00, '2024-10-15 09:30:00', 1, 'SUCCESS', 
            N'VCB2024101500123456', N'Nộp học phí HK1 2024-2025 lần 1', 1, GETDATE(), GETDATE());

GO

-- ======================================================================
-- 4. LỊCH SỬ HỌC PHÍ HỌC KỲ TRƯỚC (HK2_2023_2024) - đã nộp hết
-- ======================================================================

DECLARE @Tuition_SV001_HK2 UNIQUEIDENTIFIER;
DECLARE @Tuition_SV002_HK2 UNIQUEIDENTIFIER;
DECLARE @Sem_HK2_2324       UNIQUEIDENTIFIER;
DECLARE @Stu_SV001          UNIQUEIDENTIFIER;
DECLARE @Stu_SV002          UNIQUEIDENTIFIER;
DECLARE @Fee_CNTT_K20_2     UNIQUEIDENTIFIER;
DECLARE @Fee_CNTT_K21_2     UNIQUEIDENTIFIER;
DECLARE @Prog_CNTT_3        UNIQUEIDENTIFIER;

SELECT @Sem_HK2_2324   = id FROM semesters WHERE semester_code = 'HK2_2023_2024';
SELECT @Stu_SV001      = id FROM students WHERE student_code = 'SV20200001';
SELECT @Stu_SV002      = id FROM students WHERE student_code = 'SV20210002';
SELECT @Prog_CNTT_3    = tp.id FROM training_programs tp JOIN majors m ON tp.major_id = m.id WHERE m.major_code = 'CNTT_KTPM';
SELECT @Fee_CNTT_K20_2 = id FROM tuition_fees WHERE program_id = @Prog_CNTT_3 AND course_year = 'K20' AND is_active = 1;
SELECT @Fee_CNTT_K21_2 = id FROM tuition_fees WHERE program_id = @Prog_CNTT_3 AND course_year = 'K21' AND is_active = 1;

-- SV20200001 học kỳ trước - đã nộp đủ 5,880,000
IF @Stu_SV001 IS NOT NULL AND @Sem_HK2_2324 IS NOT NULL AND @Fee_CNTT_K20_2 IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_SV001 AND semester_id = @Sem_HK2_2324)
BEGIN
    DECLARE @Prev_Tuition1 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@Prev_Tuition1, @Stu_SV001, @Sem_HK2_2324, @Fee_CNTT_K20_2,
            14, 5880000.00, 0.00, 0.00, 5880000.00, 5880000.00, 0.00, 1, '2024-04-30', 1, GETDATE(), GETDATE());
    
    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @Prev_Tuition1, 5880000.00, '2024-03-01 10:00:00', 2, 'SUCCESS', 
            N'TIENMAT20240301', N'Nộp học phí HK2 2023-2024 (tiền mặt)', 1, GETDATE(), GETDATE());
END

-- SV20210002 học kỳ trước - đã nộp đủ
IF @Stu_SV002 IS NOT NULL AND @Sem_HK2_2324 IS NOT NULL AND @Fee_CNTT_K21_2 IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_SV002 AND semester_id = @Sem_HK2_2324)
BEGIN
    DECLARE @Prev_Tuition2 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, scholarship_deduction, exemption_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, updated_at)
    VALUES (@Prev_Tuition2, @Stu_SV002, @Sem_HK2_2324, @Fee_CNTT_K21_2,
            16, 7200000.00, 1500000.00, 0.00, 5700000.00, 5700000.00, 0.00, 1, '2024-04-30', 1, GETDATE(), GETDATE());

    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @Prev_Tuition2, 2700000.00, '2024-02-25 14:20:00', 1, 'SUCCESS', 
            N'MB2024022500098765', N'Nộp học phí HK2 lần 1 qua MB Bank', 1, GETDATE(), GETDATE());

    INSERT INTO payments (id, tuition_id, amount_paid, payment_date, payment_method, payment_status, transaction_ref, notes, is_active, created_at, updated_at)
    VALUES (NEWID(), @Prev_Tuition2, 3000000.00, '2024-03-10 09:15:00', 3, 'SUCCESS', 
            N'MOMO2024031000345678', N'Nộp học phí HK2 lần 2 qua MoMo', 1, GETDATE(), GETDATE());
END

GO
