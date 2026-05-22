-- stdmanager/src/main/resources/db/migration/V25__Create_System_Config.sql

USE [stdmanager_db];
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[system_configs]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[system_configs](
        [id] [uniqueidentifier] NOT NULL,
        [config_key] [nvarchar](100) NOT NULL,
        [config_value] [nvarchar](max) NULL,
        [description] [nvarchar](255) NULL,
        [created_at] [datetime2](7) NULL,
        [updated_at] [datetime2](7) NULL,
        [created_by] [uniqueidentifier] NULL,
        [updated_by] [uniqueidentifier] NULL,
        [is_active] [bit] NULL,
        [deleted_at] [datetime2](7) NULL,
        [deleted_by] [uniqueidentifier] NULL,
        [lock_version] [int] NULL,
        CONSTRAINT [PK_system_configs] PRIMARY KEY CLUSTERED 
        (
            [id] ASC
        )
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];

    ALTER TABLE [dbo].[system_configs] ADD CONSTRAINT [DF_system_configs_id] DEFAULT (newid()) FOR [id];
    ALTER TABLE [dbo].[system_configs] ADD CONSTRAINT [DF_system_configs_is_active] DEFAULT ((1)) FOR [is_active];
    ALTER TABLE [dbo].[system_configs] ADD CONSTRAINT [DF_system_configs_created_at] DEFAULT (getdate()) FOR [created_at];
    ALTER TABLE [dbo].[system_configs] ADD CONSTRAINT [DF_system_configs_lock_version] DEFAULT ((0)) FOR [lock_version];
    ALTER TABLE [dbo].[system_configs] ADD CONSTRAINT [UQ_system_configs_key] UNIQUE ([config_key]);
END
GO

-- Seed data for system configs
DECLARE @CurrentSemesterId UNIQUEIDENTIFIER;
SELECT TOP 1 @CurrentSemesterId = id FROM semesters WHERE semester_code = 'HK1_2024_2025';

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'SYSTEM_NAME')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('SYSTEM_NAME', N'STD MANAGER', N'Tên của hệ thống quản lý đào tạo');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'CONTACT_EMAIL')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('CONTACT_EMAIL', 'admin@stdmanager.edu.vn', N'Email liên hệ hỗ trợ');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'CONTACT_PHONE')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('CONTACT_PHONE', '024.1234.5678', N'Số điện thoại đường dây nóng');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'MIN_CREDITS')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('MIN_CREDITS', '12', N'Số tín chỉ đăng ký tối thiểu của sinh viên trong một học kỳ');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'MAX_CREDITS')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('MAX_CREDITS', '25', N'Số tín chỉ đăng ký tối đa của sinh viên trong một học kỳ');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'TUITION_PER_CREDIT')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('TUITION_PER_CREDIT', '450000', N'Đơn giá học phí trên một tín chỉ (VND)');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'ALLOW_REGISTRATION')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('ALLOW_REGISTRATION', 'true', N'Cho phép sinh viên đăng ký học phần (true/false)');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'MAINTENANCE_MODE')
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('MAINTENANCE_MODE', 'false', N'Kích hoạt chế độ bảo trì hệ thống (true/false)');

IF NOT EXISTS (SELECT 1 FROM system_configs WHERE config_key = 'CURRENT_SEMESTER_ID') AND @CurrentSemesterId IS NOT NULL
    INSERT INTO system_configs (config_key, config_value, description)
    VALUES ('CURRENT_SEMESTER_ID', CONVERT(NVARCHAR(100), @CurrentSemesterId), N'ID học kỳ hiện tại');
GO
