package uni.it.stdmanager.modules.viii_grade.dto.request;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeComponentRequest {
    private UUID id;
    private String componentCode;
    private String componentName;
    private BigDecimal weightPercentage;
    private Integer inputOrder;
    private String note;
}
