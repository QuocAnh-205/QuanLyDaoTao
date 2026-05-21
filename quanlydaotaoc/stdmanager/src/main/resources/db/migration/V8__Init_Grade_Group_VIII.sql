-- stdmanager/src/main/resources/db/migration/V8__Init_Grade_Group_VIII.sql

USE [stdmanager_db]
GO
/****** Object:  Table [dbo].[grade_components]    Script Date: 19/03/2026 7:56:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grade_components](
	[id] [uniqueidentifier] NOT NULL,
	[course_section_id] [uniqueidentifier] NOT NULL,
	[component_code] [varchar](20) NOT NULL,
	[component_name] [nvarchar](50) NOT NULL,
	[weight_percentage] [decimal](5, 2) NULL,
	[min_score] [decimal](4, 2) NULL,
	[max_score] [decimal](4, 2) NULL,
	[is_required] [bit] NOT NULL,
	[allow_retake] [bit] NOT NULL,
	[input_order] [int] NULL,
	[note] [nvarchar](255) NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_grade_components] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT ((0)) FOR [is_required]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT ((0)) FOR [allow_retake]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO



/****** Object:  Table [dbo].[grade_scales]    Script Date: 3/19/2026 7:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grade_scales](
	[id] [uniqueidentifier] NOT NULL,
	[scale_code] [varchar](10) NOT NULL,
	[min_score] [decimal](4, 2) NULL,
	[max_score] [decimal](4, 2) NULL,
	[letter_grade] [varchar](2) NULL,
	[gpa_value] [decimal](3, 2) NULL,
	[description] [nvarchar](100) NULL,
	[is_pass] [bit] NOT NULL,
	[display_order] [int] NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_grade_scales] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT ((0)) FOR [is_pass]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO


-- 4. Bảng student_component_grades: Điểm thành phần
CREATE TABLE [dbo].[student_component_grades](
	[id] [uniqueidentifier] NOT NULL,
	[registration_id] [uniqueidentifier] NOT NULL,
	[component_id] [uniqueidentifier] NOT NULL,
	[score] [decimal](4, 2) NULL,
	[is_retake] [bit] NOT NULL,
	[is_locked] [bit] NOT NULL,
	[graded_at] [datetime2](7) NULL,
	[graded_by] [uniqueidentifier] NULL,
	[note] [nvarchar](255) NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_student_component_grades] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT ((0)) FOR [is_retake]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT ((0)) FOR [is_locked]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO

-- 5. Bảng student_summaries: Điểm tổng kết
CREATE TABLE [dbo].[student_summaries](
	[id] [uniqueidentifier] NOT NULL,
	[registration_id] [uniqueidentifier] NOT NULL,
	[total_score] [decimal](4, 2) NULL,
	[scale_id] [uniqueidentifier] NULL,
	[letter_grade] [varchar](2) NULL,
	[gpa_value] [decimal](3, 2) NULL,
	[result] [varchar](10) NULL,
	[is_finalized] [bit] NOT NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_student_summaries] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT ((0)) FOR [is_finalized]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO