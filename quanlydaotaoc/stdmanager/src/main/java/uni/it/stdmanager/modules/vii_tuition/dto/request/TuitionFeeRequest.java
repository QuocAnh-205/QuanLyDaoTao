package uni.it.stdmanager.modules.vii_tuition.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TuitionFeeRequest {
    private UUID programId;
    private String courseYear; // VD: K23, K24
    private BigDecimal pricePerCredit;
    private BigDecimal baseTuition;
    private LocalDate effectiveDate;
}
