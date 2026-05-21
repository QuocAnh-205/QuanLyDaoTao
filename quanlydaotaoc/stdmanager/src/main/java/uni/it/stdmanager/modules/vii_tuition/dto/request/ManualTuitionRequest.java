package uni.it.stdmanager.modules.vii_tuition.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Request để thêm thủ công một bản ghi học phí sinh viên.
 * Không cần phải có đăng ký học phần – Admin/Giáo vụ nhập trực tiếp.
 */
@Data
public class ManualTuitionRequest {
    /** Mã sinh viên (student_code) hoặc UUID */
    private String studentCode;

    private UUID semesterId;

    /** Số tín chỉ đăng ký (nhập tay) */
    private Integer totalCredits;

    /** Học phí gốc (rawAmount). Nếu null → tự tính từ định mức & credits */
    private BigDecimal rawAmount;

    /** Học bổng */
    private BigDecimal scholarshipDeduction;

    /** Miễn giảm chính sách */
    private BigDecimal exemptionAmount;

    /** Tiền đã nộp trước đó */
    private BigDecimal paidAmount;

    /** Hạn nộp */
    private LocalDate deadline;

    /** Ghi chú nội bộ */
    private String notes;
}
