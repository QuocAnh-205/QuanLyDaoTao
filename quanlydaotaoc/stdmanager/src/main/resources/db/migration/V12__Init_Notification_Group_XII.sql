-- stdmanager/src/main/resources/db/migration/V12__Init_Notification_Group_XII.sql


USE [stdmanager_db]
GO

/****** Object:  Table [dbo].[logs]    Script Date: 3/19/2026 8:49:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[logs](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[action] [nvarchar](100) NULL,
	[table_name] [nvarchar](100) NULL,
	[record_id] [uniqueidentifier] NULL,
	[description] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[logs] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[logs] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[logs] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[logs]  WITH CHECK ADD  CONSTRAINT [FK_logs_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[logs] CHECK CONSTRAINT [FK_logs_user]
GO




/****** Object:  Table [dbo].[notifications]    Script Date: 3/19/2026 8:45:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[notifications](
	[id] [uniqueidentifier] NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[content] [nvarchar](max) NULL,
	[type_id] [uniqueidentifier] NULL,
	[target_role_id] [uniqueidentifier] NULL,
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
ALTER TABLE [dbo].[notifications] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[notifications]  WITH CHECK ADD  CONSTRAINT [FK_notifications_role] FOREIGN KEY([target_role_id])
REFERENCES [dbo].[roles] ([id])
GO
ALTER TABLE [dbo].[notifications] CHECK CONSTRAINT [FK_notifications_role]
GO



/****** Object:  Table [dbo].[settings]    Script Date: 3/19/2026 8:50:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[settings](
	[id] [uniqueidentifier] NOT NULL,
	[key] [nvarchar](100) NOT NULL,
	[value] [nvarchar](max) NULL,
	[description] [nvarchar](255) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[settings] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[settings] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[settings] ADD  DEFAULT (getdate()) FOR [created_at]
GO




/****** Object:  Table [dbo].[user_notifications]    Script Date: 3/19/2026 8:47:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_notifications](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[notification_id] [uniqueidentifier] NOT NULL,
	[is_read] [bit] NULL,
	[read_at] [datetime2](7) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT ((0)) FOR [is_read]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[user_notifications]  WITH CHECK ADD  CONSTRAINT [FK_user_notifications_notification] FOREIGN KEY([notification_id])
REFERENCES [dbo].[notifications] ([id])
GO
ALTER TABLE [dbo].[user_notifications] CHECK CONSTRAINT [FK_user_notifications_notification]
GO
ALTER TABLE [dbo].[user_notifications]  WITH CHECK ADD  CONSTRAINT [FK_user_notifications_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_notifications] CHECK CONSTRAINT [FK_user_notifications_user]
GO