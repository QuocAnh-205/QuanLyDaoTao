-- stdmanager/src/main/resources/db/migration/V9__Init_Tuition_Group_IX.sql

-- 1. Bảng tuition_fees: Mức định mức học phí theo tín chỉ hoặc chương trình
CREATE TABLE tuition_fees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    program_id UNIQUEIDENTIFIER, -- Liên kết với bảng Chương trình đào tạo
    course_year VARCHAR(10), -- Khóa học (Ví dụ: K23, K24)
    price_per_credit DECIMAL(15, 2), -- Đơn giá cho mỗi tín chỉ
    base_tuition DECIMAL(15, 2), -- Học phí cố định mỗi kỳ
    effective_date DATE, -- Ngày bắt đầu áp dụng mức phí
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo định mức
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật định mức
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER -- Người thực hiện xóa
);
GO

-- 2. Bảng student_tuition: Học phí sinh viên theo từng học kỳ
CREATE TABLE student_tuition (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    student_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết với bảng sinh viên
    semester_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết với bảng học kỳ
    tuition_fee_id UNIQUEIDENTIFIER, -- FK tham chiếu tuition_fees
    total_credits INT, -- Tổng số tín chỉ đăng ký trong kỳ
    raw_amount DECIMAL(15, 2), -- Tổng tiền gốc (tín chỉ x đơn giá)
    scholarship_deduction DECIMAL(15, 2), -- Số tiền được trừ từ học bổng
    exemption_amount DECIMAL(15, 2), -- Số tiền được miễn giảm chính sách
    net_amount DECIMAL(15, 2), -- Số tiền thực nộp (gốc - giảm - học bổng)
    paid_amount DECIMAL(15, 2) DEFAULT 0, -- Tổng số tiền đã nộp
    debt_amount DECIMAL(15, 2), -- Số tiền còn nợ
    status TINYINT, -- Trạng thái: 1-PAID, 2-PARTIAL, 3-DEBT, 4-OVERDUE
    deadline DATE, -- Hạn chót hoàn thành học phí
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo bản ghi
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo/Hệ thống tạo
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện xóa
    CONSTRAINT FK_StudentTuition_Students FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT FK_StudentTuition_Semesters FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT FK_StudentTuition_TuitionFees FOREIGN KEY (tuition_fee_id) REFERENCES tuition_fees(id)
);
GO

-- 3. Bảng payments: Lịch sử giao dịch thanh toán học phí
CREATE TABLE payments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính giao dịch
    tuition_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết với bảng student_tuition
    amount_paid DECIMAL(15, 2) NOT NULL, -- Số tiền nộp trong lần này
    payment_date DATETIME2 DEFAULT GETDATE(), -- Ngày giờ thực tế giao dịch
    payment_method TINYINT, -- 1-Bank Transfer, 2-Cash, 3-E-wallet
    payment_status VARCHAR(20), -- PENDING, SUCCESS, FAILED, REFUNDED, CANCELLED
    transaction_ref VARCHAR(100), -- Mã tham chiếu ngân hàng
    cashier_id UNIQUEIDENTIFIER, -- Người thu tiền hoặc hệ thống tự động
    notes NVARCHAR(MAX), -- Ghi chú thêm
    is_active BIT DEFAULT 1, -- Trạng thái giao dịch
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm ghi nhận vào hệ thống
    updated_at DATETIME2, -- Thời điểm cập nhật cuối
    created_by UNIQUEIDENTIFIER, -- Người thực hiện ghi nhận
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật thông tin
    deleted_at DATETIME2, -- Thời điểm hủy/xóa giao dịch
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện hủy
    CONSTRAINT FK_Payments_StudentTuition FOREIGN KEY (tuition_id) REFERENCES student_tuition(id)
);
GO