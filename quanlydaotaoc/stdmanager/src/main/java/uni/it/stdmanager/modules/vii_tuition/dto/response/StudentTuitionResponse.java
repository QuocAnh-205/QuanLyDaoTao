package uni.it.stdmanager.modules.vii_tuition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentTuitionResponse {
    private UUID id;
    private UUID studentId;
    private String studentCode;
    private String studentName;
    private String className;
    private UUID semesterId;
    private String semesterName;
    private String semesterCode;
    private Integer totalCredits;
    private BigDecimal rawAmount;
    private BigDecimal scholarshipDeduction;
    private BigDecimal exemptionAmount;
    private BigDecimal netAmount;
    private BigDecimal paidAmount;
    private BigDecimal debtAmount;
    private Integer status;
    private LocalDate deadline;
    private BigDecimal pricePerCredit;
    private BigDecimal baseTuition;
}
