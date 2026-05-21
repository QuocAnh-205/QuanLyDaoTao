-- stdmanager/src/main/resources/db/migration/V4__Init_Course_Group_IV.sql


USE [stdmanager_db]
GO
/****** Object:  Table [dbo].[course_prerequisites]    Script Date: 19/03/2026 9:10:03 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[course_prerequisites](
	[id] [uniqueidentifier] NOT NULL,
	[course_id] [uniqueidentifier] NULL,
	[prerequisite_course_id] [uniqueidentifier] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[courses]    Script Date: 19/03/2026 9:10:03 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[courses](
	[id] [uniqueidentifier] NOT NULL,
	[department_id] [uniqueidentifier] NULL,
	[course_code] [varchar](20) NULL,
	[course_name] [nvarchar](255) NULL,
	[course_name_en] [nvarchar](255) NULL,
	[credits] [decimal](5, 1) NULL,
	[course_type] [varchar](20) NULL,
	[theory_hours] [decimal](5, 1) NULL,
	[practice_hours] [decimal](5, 1) NULL,
	[self_study_hours] [decimal](5, 1) NULL,
	[internship_credits] [decimal](5, 1) NULL,
	[description] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


USE [stdmanager_db]
GO
/****** Object:  Table [dbo].[majors]    Script Date: 19/03/2026 9:06:40 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[majors](
	[id] [uniqueidentifier] NOT NULL,
	[department_id] [uniqueidentifier] NULL,
	[major_code] [varchar](20) NULL,
	[major_name] [nvarchar](255) NULL,
	[description] [nvarchar](max) NULL,
	[effective_date] [date] NULL,
	[expiry_date] [date] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[training_program_courses]    Script Date: 19/03/2026 9:06:40 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[training_program_courses](
	[id] [uniqueidentifier] NOT NULL,
	[training_program_id] [uniqueidentifier] NULL,
	[course_id] [uniqueidentifier] NULL,
	[course_code] [varchar](50) NULL,
	[course_name] [nvarchar](255) NULL,
	[semester] [int] NULL,
	[year] [int] NULL,
	[is_required] [bit] NULL,
	[group_code] [nvarchar](50) NULL,
	[credits] [decimal](5, 1) NULL,
	[prerequisite_course_id] [uniqueidentifier] NULL,
	[is_prerequisite_required] [bit] NULL,
	[note] [nvarchar](500) NULL,
	[sort_order] [int] NULL,
	[status] [nvarchar](20) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[training_programs]    Script Date: 19/03/2026 9:06:40 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[training_programs](
	[id] [uniqueidentifier] NOT NULL,
	[program_code] [varchar](50) NULL,
	[program_name] [nvarchar](255) NULL,
	[program_name_en] [nvarchar](255) NULL,
	[major_id] [uniqueidentifier] NULL,
	[department_id] [uniqueidentifier] NULL,
	[degree_level] [nvarchar](50) NULL,
	[education_type] [nvarchar](50) NULL,
	[total_credits] [decimal](5, 1) NULL,
	[required_credits] [decimal](5, 1) NULL,
	[elective_credits] [decimal](5, 1) NULL,
	[internship_credits] [decimal](5, 1) NULL,
	[thesis_credits] [decimal](5, 1) NULL,
	[admission_year] [date] NULL,
	[duration_years] [decimal](5, 1) NULL,
	[max_duration_years] [decimal](5, 1) NULL,
	[effective_date] [date] NULL,
	[expiry_date] [date] NULL,
	[description] [nvarchar](max) NULL,
	[objectives] [nvarchar](max) NULL,
	[learning_outcomes] [nvarchar](max) NULL,
	[version] [nvarchar](20) NULL,
	[status] [nvarchar](20) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO