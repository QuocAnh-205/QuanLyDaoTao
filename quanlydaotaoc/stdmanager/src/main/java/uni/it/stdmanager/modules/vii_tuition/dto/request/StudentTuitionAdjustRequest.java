package uni.it.stdmanager.modules.vii_tuition.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StudentTuitionAdjustRequest {
    private BigDecimal scholarshipDeduction;
    private BigDecimal exemptionAmount;
}
