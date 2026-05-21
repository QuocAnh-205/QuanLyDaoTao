-- stdmanager/src/main/resources/db/migration/V20__Add_Missing_Columns_Group_VI.sql

USE [stdmanager_db];
GO

-- Bổ sung cột is_active cho bảng course_registrations
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('course_registrations') AND name = 'is_active')
BEGIN
    ALTER TABLE [course_registrations] ADD [is_active] BIT DEFAULT 1;
END
GO

-- Đảm bảo tất cả bản ghi hiện tại đều có is_active = 1
UPDATE [course_registrations] SET [is_active] = 1 WHERE [is_active] IS NULL;
GO
