package uni.it.stdmanager.modules.viii_grade.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentGradeDetailResponse {
    private UUID registrationId;
    private UUID studentId;
    private String studentCode;
    private String studentName;
    private List<ComponentGradeResponse> componentGrades;
    private BigDecimal totalScore;
    private String letterGrade;
    private BigDecimal gpaValue;
    private String result;
    private Boolean isFinalized;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComponentGradeResponse {
        private UUID componentGradeId;
        private UUID componentId;
        private String componentCode;
        private BigDecimal score;
        private Boolean isLocked;
        private String note;
    }
}
