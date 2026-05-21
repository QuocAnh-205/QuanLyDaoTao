package uni.it.stdmanager.modules.iv_course.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramResponse {
    private UUID id;
    private String programCode;
    private String programName;
    private String majorName;
    private String degreeLevel;
    private String educationType;
    private BigDecimal totalCredits;
    private String version;
    private String status;
}
