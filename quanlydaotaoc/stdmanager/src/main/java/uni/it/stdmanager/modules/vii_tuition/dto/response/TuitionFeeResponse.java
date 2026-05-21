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
public class TuitionFeeResponse {
    private UUID id;
    private UUID programId;
    private String programName;
    private String programCode;
    private String courseYear;
    private BigDecimal pricePerCredit;
    private BigDecimal baseTuition;
    private LocalDate effectiveDate;
    private Boolean isActive;
}
