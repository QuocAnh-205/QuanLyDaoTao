-- stdmanager/src/main/resources/db/migration/V10__Init_Exam_Group_X.sql

USE [stdmanager_db]
GO

-- 1. Bảng exam_types (Loại kỳ thi)
CREATE TABLE [dbo].[exam_types](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [name] [nvarchar](100) NOT NULL,
    [description] [nvarchar](MAX) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

-- 2. Bảng exams (Lịch thi)
CREATE TABLE [dbo].[exams](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_type_id] [uniqueidentifier] NOT NULL,
    [course_section_id] [uniqueidentifier] NOT NULL, -- Sẽ liên kết với bảng lớp học/học phần sau
    [semester_id] [uniqueidentifier] NOT NULL,     -- Sẽ liên kết với bảng học kỳ sau
    [exam_date] [date] NULL,
    [start_time] [time](7) NULL,
    [duration_minutes] [smallint] NULL,
    [end_time] [time](7) NULL,
    [exam_format] [varchar](20) NULL,
    [exam_status] [varchar](20) NULL,
    [supervisor_count] [tinyint] DEFAULT 1,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Exams_ExamTypes] FOREIGN KEY([exam_type_id]) REFERENCES [dbo].[exam_types] ([id]),
CONSTRAINT [FK_Exams_CourseSections] FOREIGN KEY([course_section_id]) REFERENCES [dbo].[course_sections] ([id]),
CONSTRAINT [FK_Exams_Semesters] FOREIGN KEY([semester_id]) REFERENCES [dbo].[semesters] ([id])
) ON [PRIMARY]
GO

-- 3. Bảng exam_rooms (Phòng thi)
CREATE TABLE [dbo].[exam_rooms](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_id] [uniqueidentifier] NOT NULL,
    [room_id] [uniqueidentifier] NOT NULL, -- Liên kết với danh mục phòng học chung
    [capacity] [int] NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_ExamRooms_Exams] FOREIGN KEY([exam_id]) REFERENCES [dbo].[exams] ([id])
) ON [PRIMARY]
GO

-- 4. Bảng exam_registrations (Danh sách thí sinh)
CREATE TABLE [dbo].[exam_registrations](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_id] [uniqueidentifier] NOT NULL,
    [exam_room_id] [uniqueidentifier] NOT NULL,
    [student_id] [uniqueidentifier] NOT NULL,
    [roll_number] [varchar](20) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Registrations_Exams] FOREIGN KEY([exam_id]) REFERENCES [dbo].[exams] ([id]),
CONSTRAINT [FK_Registrations_ExamRooms] FOREIGN KEY([exam_room_id]) REFERENCES [dbo].[exam_rooms] ([id]),
CONSTRAINT [FK_Registrations_Students] FOREIGN KEY([student_id]) REFERENCES [dbo].[students] ([id])
) ON [PRIMARY]
GO

-- 5. Bảng exam_results (Kết quả thi)
CREATE TABLE [dbo].[exam_results](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [registration_id] [uniqueidentifier] NOT NULL,
    [score] [decimal](4, 2) NULL,
    [status] [nvarchar](50) NULL,
    [graded_by] [uniqueidentifier] NULL,
    [graded_at] [datetime] NULL,
    [is_locked] [bit] DEFAULT 0,
    [appeal_status] [varchar](20) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Results_Registrations] FOREIGN KEY([registration_id]) REFERENCES [dbo].[exam_registrations] ([id])
) ON [PRIMARY]
GO

-- 6. Bảng exam_papers (Đề thi)
CREATE TABLE [dbo].[exam_papers](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_id] [uniqueidentifier] NOT NULL,
    [paper_code] [varchar](20) NULL,
    [file_url] [nvarchar](500) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Papers_Exams] FOREIGN KEY([exam_id]) REFERENCES [dbo].[exams] ([id])
) ON [PRIMARY]
GO