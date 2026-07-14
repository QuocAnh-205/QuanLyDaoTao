-- stdmanager/src/main/resources/db/migration/V25__Insert_Grade_Scales.sql
USE [stdmanager_db];
GO

-- Seed data for grade_scales
IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'A')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('A', 8.50, 10.00, 'A', 4.00, N'Xuất sắc / Giỏi', 1, 1);

IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'B+')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('B+', 8.00, 8.49, 'B+', 3.50, N'Khá giỏi', 1, 2);

IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'B')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('B', 7.00, 7.99, 'B', 3.00, N'Khá', 1, 3);

IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'C+')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('C+', 6.50, 6.99, 'C+', 2.50, N'Trung bình khá', 1, 4);

IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'C')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('C', 5.50, 6.49, 'C', 2.00, N'Trung bình', 1, 5);

IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'D+')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('D+', 5.00, 5.49, 'D+', 1.50, N'Trung bình yếu', 1, 6);

IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'D')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('D', 4.00, 4.99, 'D', 1.00, N'Yếu (Đạt tối thiểu)', 1, 7);

IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'F')
    INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
    VALUES ('F', 0.00, 3.99, 'F', 0.00, N'Kém (Không đạt)', 0, 8);
GO
