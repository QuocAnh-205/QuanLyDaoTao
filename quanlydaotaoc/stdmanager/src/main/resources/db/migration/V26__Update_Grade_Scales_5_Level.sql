-- Seed data for new 5-level grade scales as requested by user
USE [stdmanager_db];
GO

-- Clear existing grade scales
DELETE FROM grade_scales;

-- Insert new 5-level grade scales
INSERT INTO grade_scales (scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order)
VALUES 
('A', 8.45, 10.00, 'A', 4.00, N'Giỏi', 1, 1),
('B', 6.95, 8.44, 'B', 3.00, N'Khá', 1, 2),
('C', 5.45, 6.94, 'C', 2.00, N'Trung bình', 1, 3),
('D', 3.95, 5.44, 'D', 1.00, N'Trung bình yếu', 1, 4),
('F', 0.00, 3.94, 'F', 0.00, N'Kém', 0, 5);
GO
