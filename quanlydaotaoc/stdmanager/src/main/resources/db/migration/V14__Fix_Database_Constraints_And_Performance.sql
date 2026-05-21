-- stdmanager/src/main/resources/db/migration/V14__Fix_Database_Constraints_And_Performance.sql

-- ======================================================================
-- 1. CHUẨN HÓA KIỂU DỮ LIỆU (Data Type Normalization)
-- ======================================================================

-- Chuyển đổi room_id và building_id trong course_sections sang UNIQUEIDENTIFIER 
-- để khớp với bảng rooms và buildings
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('course_sections') AND name = 'room_id' AND TYPE_NAME(system_type_id) != 'uniqueidentifier')
BEGIN
    -- Xóa dữ liệu không hợp lệ (không phải GUID hoặc không tồn tại trong bảng gốc)
    UPDATE course_sections SET room_id = NULL 
    WHERE room_id IS NOT NULL AND (TRY_CAST(room_id AS UNIQUEIDENTIFIER) IS NULL OR TRY_CAST(room_id AS UNIQUEIDENTIFIER) NOT IN (SELECT id FROM rooms));
    
    ALTER TABLE course_sections ALTER COLUMN room_id UNIQUEIDENTIFIER;
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('course_sections') AND name = 'building_id' AND TYPE_NAME(system_type_id) != 'uniqueidentifier')
BEGIN
    UPDATE course_sections SET building_id = NULL 
    WHERE building_id IS NOT NULL AND (TRY_CAST(building_id AS UNIQUEIDENTIFIER) IS NULL OR TRY_CAST(building_id AS UNIQUEIDENTIFIER) NOT IN (SELECT id FROM buildings));
    
    ALTER TABLE course_sections ALTER COLUMN building_id UNIQUEIDENTIFIER;
END
GO

-- ======================================================================
-- 2. DỌN DẸP DỮ LIỆU RÁC (Orphan Cleanup)
-- ======================================================================

-- Group II: Student & Classes
UPDATE student_classes SET major_id = NULL WHERE major_id IS NOT NULL AND major_id NOT IN (SELECT id FROM majors);
UPDATE student_classes SET department_id = NULL WHERE department_id IS NOT NULL AND department_id NOT IN (SELECT id FROM departments);
UPDATE student_classes SET advisor_id = NULL WHERE advisor_id IS NOT NULL AND advisor_id NOT IN (SELECT id FROM employees);

UPDATE students SET department_id = NULL WHERE department_id IS NOT NULL AND department_id NOT IN (SELECT id FROM departments);
UPDATE students SET major_id = NULL WHERE major_id IS NOT NULL AND major_id NOT IN (SELECT id FROM majors);
UPDATE students SET program_id = NULL WHERE program_id IS NOT NULL AND program_id NOT IN (SELECT id FROM training_programs);
GO

-- Group V: Course Sections
DELETE FROM course_sections WHERE course_id NOT IN (SELECT id FROM courses);
DELETE FROM course_sections WHERE semester_id NOT IN (SELECT id FROM semesters);
UPDATE course_sections SET lecturer_id = NULL WHERE lecturer_id IS NOT NULL AND lecturer_id NOT IN (SELECT id FROM employees);
GO

-- Group VI: Registrations
DELETE FROM course_registrations WHERE student_id NOT IN (SELECT id FROM students);
DELETE FROM course_registrations WHERE course_section_id NOT IN (SELECT id FROM course_sections);
DELETE FROM course_registrations WHERE registration_period_id NOT IN (SELECT id FROM registration_periods);
UPDATE registration_periods SET semester_id = (SELECT TOP 1 id FROM semesters) WHERE semester_id NOT IN (SELECT id FROM semesters); -- Fallback to a valid semester if possible, or DELETE
GO

-- Group VIII: Grades & Summaries
UPDATE grade_components SET course_section_id = NULL WHERE course_section_id IS NOT NULL AND course_section_id NOT IN (SELECT id FROM course_sections);
DELETE FROM student_component_grades WHERE registration_id NOT IN (SELECT id FROM course_registrations);
DELETE FROM student_component_grades WHERE component_id NOT IN (SELECT id FROM grade_components);
DELETE FROM student_summaries WHERE registration_id NOT IN (SELECT id FROM course_registrations);
UPDATE student_summaries SET scale_id = NULL WHERE scale_id IS NOT NULL AND scale_id NOT IN (SELECT id FROM grade_scales);
GO

-- ======================================================================
-- 3. BỔ SUNG FOREIGN KEY CONSTRAINTS (Referential Integrity)
-- ======================================================================

-- Group II: Student & Classes
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentClasses_Majors')
    ALTER TABLE student_classes ADD CONSTRAINT FK_StudentClasses_Majors FOREIGN KEY (major_id) REFERENCES majors(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentClasses_Departments')
    ALTER TABLE student_classes ADD CONSTRAINT FK_StudentClasses_Departments FOREIGN KEY (department_id) REFERENCES departments(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentClasses_Advisors')
    ALTER TABLE student_classes ADD CONSTRAINT FK_StudentClasses_Advisors FOREIGN KEY (advisor_id) REFERENCES employees(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Departments')
    ALTER TABLE students ADD CONSTRAINT FK_Students_Departments FOREIGN KEY (department_id) REFERENCES departments(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Majors')
    ALTER TABLE students ADD CONSTRAINT FK_Students_Majors FOREIGN KEY (major_id) REFERENCES majors(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Programs')
    ALTER TABLE students ADD CONSTRAINT FK_Students_Programs FOREIGN KEY (program_id) REFERENCES training_programs(id);
GO

-- Group V: Semesters & Course Sections
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Courses')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Courses FOREIGN KEY (course_id) REFERENCES courses(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Semesters')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Semesters FOREIGN KEY (semester_id) REFERENCES semesters(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Lecturers')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Lecturers FOREIGN KEY (lecturer_id) REFERENCES employees(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Rooms')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Rooms FOREIGN KEY (room_id) REFERENCES rooms(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Buildings')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Buildings FOREIGN KEY (building_id) REFERENCES buildings(id);
GO

-- Group VI: Registrations
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Registrations_Students')
    ALTER TABLE course_registrations ADD CONSTRAINT FK_Registrations_Students FOREIGN KEY (student_id) REFERENCES students(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Registrations_Sections')
    ALTER TABLE course_registrations ADD CONSTRAINT FK_Registrations_Sections FOREIGN KEY (course_section_id) REFERENCES course_sections(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Registrations_Periods')
    ALTER TABLE course_registrations ADD CONSTRAINT FK_Registrations_Periods FOREIGN KEY (registration_period_id) REFERENCES registration_periods(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_RegistrationPeriods_Semesters')
    ALTER TABLE registration_periods ADD CONSTRAINT FK_RegistrationPeriods_Semesters FOREIGN KEY (semester_id) REFERENCES semesters(id);
GO

-- Group VIII: Grades
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_GradeComponents_Sections')
    ALTER TABLE grade_components ADD CONSTRAINT FK_GradeComponents_Sections FOREIGN KEY (course_section_id) REFERENCES course_sections(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ComponentGrades_Registrations')
    ALTER TABLE student_component_grades ADD CONSTRAINT FK_ComponentGrades_Registrations FOREIGN KEY (registration_id) REFERENCES course_registrations(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ComponentGrades_Components')
    ALTER TABLE student_component_grades ADD CONSTRAINT FK_ComponentGrades_Components FOREIGN KEY (component_id) REFERENCES grade_components(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Summaries_Registrations')
    ALTER TABLE student_summaries ADD CONSTRAINT FK_Summaries_Registrations FOREIGN KEY (registration_id) REFERENCES course_registrations(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Summaries_Scales')
    ALTER TABLE student_summaries ADD CONSTRAINT FK_Summaries_Scales FOREIGN KEY (scale_id) REFERENCES grade_scales(id);
GO

-- ======================================================================
-- 4. TỐI ƯU HÓA HIỆU SUẤT (Indexing)
-- ======================================================================

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_FullName' AND object_id = OBJECT_ID('students'))
    CREATE INDEX IX_Students_FullName ON students(full_name);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email' AND object_id = OBJECT_ID('users'))
    CREATE INDEX IX_Users_Email ON users(email);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Phone' AND object_id = OBJECT_ID('users'))
    CREATE INDEX IX_Users_Phone ON users(phone);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Employees_FullName' AND object_id = OBJECT_ID('employees'))
    CREATE INDEX IX_Employees_FullName ON employees(full_name);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Courses_Name' AND object_id = OBJECT_ID('courses'))
    CREATE INDEX IX_Courses_Name ON courses(course_name);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_ClassId' AND object_id = OBJECT_ID('students'))
    CREATE INDEX IX_Students_ClassId ON students(class_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseSections_CourseId' AND object_id = OBJECT_ID('course_sections'))
    CREATE INDEX IX_CourseSections_CourseId ON course_sections(course_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseSections_SemesterId' AND object_id = OBJECT_ID('course_sections'))
    CREATE INDEX IX_CourseSections_SemesterId ON course_sections(semester_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseRegistrations_StudentId' AND object_id = OBJECT_ID('course_registrations'))
    CREATE INDEX IX_CourseRegistrations_StudentId ON course_registrations(student_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseRegistrations_SectionId' AND object_id = OBJECT_ID('course_registrations'))
    CREATE INDEX IX_CourseRegistrations_SectionId ON course_registrations(course_section_id);
GO

-- ======================================================================
-- 5. XỬ LÝ TRANH CHẤP DỮ LIỆU (Concurrency Control)
-- ======================================================================

DECLARE @tableName NVARCHAR(255);
DECLARE @schemaTable NVARCHAR(255);
DECLARE table_cursor CURSOR FOR 
SELECT QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name)
FROM sys.tables
WHERE is_ms_shipped = 0;

OPEN table_cursor;
FETCH NEXT FROM table_cursor INTO @schemaTable;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @sql NVARCHAR(MAX) = 'IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(''' + @schemaTable + ''') AND name = ''lock_version'') 
                                 BEGIN ALTER TABLE ' + @schemaTable + ' ADD lock_version INT DEFAULT 0; END';
    EXEC sp_executesql @sql;
    FETCH NEXT FROM table_cursor INTO @schemaTable;
END

CLOSE table_cursor;
DEALLOCATE table_cursor;
GO
