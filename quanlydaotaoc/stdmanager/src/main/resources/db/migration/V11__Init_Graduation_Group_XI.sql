-- stdmanager/src/main/resources/db/migration/V11__Init_Graduation_Group_XI.sql

USE [stdmanager_db]
GO

/****** Object:  Table [dbo].[graduation_conditions]    Script Date: 19/03/2026 08:21:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[graduation_conditions](
	[id] [uniqueidentifier] NOT NULL,
	[program_id] [uniqueidentifier] NOT NULL,
	[applied_cohort] [nvarchar](10) NULL,
	[min_total_credits] [int] NULL,
	[min_gpa] [decimal](3, 2) NULL,
	[max_failed_credits] [int] NULL,
	[english_requirement] [nvarchar](100) NULL,
	[it_requirement] [nvarchar](100) NULL,
	[conduct_required] [nvarchar](50) NULL,
	[note] [nvarchar](max) NULL,
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
ALTER TABLE [dbo].[graduation_conditions] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[graduation_conditions] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[graduation_conditions] ADD  DEFAULT ((1)) FOR [is_active]
GO



/****** Object:  Table [dbo].[graduation_results]    Script Date: 19/03/2026 08:23:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[graduation_results](
	[id] [uniqueidentifier] NOT NULL,
	[student_id] [uniqueidentifier] NOT NULL,
	[condition_id] [uniqueidentifier] NULL,
	[gpa] [decimal](3, 2) NULL,
	[total_credits] [int] NULL,
	[failed_credits] [int] NULL,
	[result] [tinyint] NULL,
	[classification] [tinyint] NULL,
	[decision_date] [date] NULL,
	[reviewer] [uniqueidentifier] NULL,
	[note] [nvarchar](max) NULL,
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
ALTER TABLE [dbo].[graduation_results] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[graduation_results] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[graduation_results] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[graduation_results]  WITH CHECK ADD  CONSTRAINT [FK_GraduationResults_Conditions] FOREIGN KEY([condition_id])
REFERENCES [dbo].[graduation_conditions] ([id])
GO
ALTER TABLE [dbo].[graduation_results] CHECK CONSTRAINT [FK_GraduationResults_Conditions]
GO