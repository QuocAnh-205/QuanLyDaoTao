package uni.it.stdmanager.modules.viii_grade.dto.request;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentComponentGradeInput {
    private UUID componentId;
    private BigDecimal score;
    private String note;
}
