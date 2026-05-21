-- stdmanager/src/main/resources/db/migration/V7__Init_Schedule_Group_VII.sql

-- 1. Bảng buildings: Quản lý thông tin tòa nhà 35]
CREATE TABLE buildings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    building_code VARCHAR(10) NOT NULL UNIQUE, -- Mã tòa nhà
    building_name NVARCHAR(100) NOT NULL, -- Tên tòa nhà
    address NVARCHAR(200), -- Địa chỉ khuôn viên
    total_floors TINYINT, -- Tổng số tầng
    building_type VARCHAR(10), -- Loại tòa nhà
    description NVARCHAR(255), -- Mô tả chức năng
    note NVARCHAR(255), -- Ghi chú vận hành
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực 35]
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER --
);
GO

-- 2. Bảng rooms: Quản lý thông tin chi tiết phòng học 29]
CREATE TABLE rooms (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    room_code VARCHAR(20) NOT NULL UNIQUE, -- Mã phòng
    room_name NVARCHAR(100), -- Tên đầy đủ của phòng
    building_id UNIQUEIDENTIFIER NOT NULL, -- Khóa ngoại liên kết Buildings
    floor INT, -- Vị trí tầng
    capacity INT, -- Sức chứa sinh viên
    room_type NVARCHAR(50), -- Loại phòng (Lab, lý thuyết...)
    status NVARCHAR(50), -- Tình trạng sử dụng
    has_projector BIT DEFAULT 0, --
    has_air_conditioner BIT DEFAULT 0, --
    has_computer BIT DEFAULT 0, --
    description NVARCHAR(255), --
    is_active BIT DEFAULT 1, --
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    CONSTRAINT FK_Rooms_Buildings FOREIGN KEY (building_id) REFERENCES Buildings(id)
);
GO

-- 3. Bảng time_slots: Định nghĩa khung giờ ca học 32, 33]
CREATE TABLE time_slots (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    slot_code NVARCHAR(50) NOT NULL UNIQUE, -- Mã ca học (Ca1, Ca2...)
    start_time TIME NOT NULL, -- Giờ bắt đầu
    end_time TIME NOT NULL, -- Giờ kết thúc
    is_active BIT DEFAULT 1, -- 32]
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER --
);
GO

-- 5. Bảng schedules: Lịch học chi tiết cho từng lớp học phần 30]
CREATE TABLE schedules (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    course_section_id UNIQUEIDENTIFIER NOT NULL, -- FK -> course_sections
    lecturer_id UNIQUEIDENTIFIER, -- Giảng viên phụ trách
    room_id UNIQUEIDENTIFIER, -- Phòng học
    day_of_week INT, -- Thứ trong tuần
    date DATE, -- Ngày cụ thể 
    shift NVARCHAR(50), -- Ca học
    start_period INT, -- Tiết bắt đầu
    end_period INT, -- Tiết kết thúc
    number_of_periods INT, -- Số tiết thực tế
    start_date DATETIME2, -- Ngày bắt đầu học phần
    end_date DATETIME2, -- Ngày kết thúc học phần
    mode NVARCHAR(100), -- ONLINE/OFFLINE/HYBRID
    status NVARCHAR(255), -- Trạng thái (OFFICIAL/CANCELLED...)
    schedule_status VARCHAR(50), -- Trạng thái lịch
    note NVARCHAR(255), -- Ghi chú thay đổi lịch
    is_active BIT DEFAULT 1, --
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    CONSTRAINT FK_Schedules_Rooms FOREIGN KEY (room_id) REFERENCES Rooms(id),
    CONSTRAINT FK_Schedules_Lecturers FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO