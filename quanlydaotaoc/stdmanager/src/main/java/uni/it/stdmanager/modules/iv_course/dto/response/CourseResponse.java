package uni.it.stdmanager.modules.iv_course.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private UUID id;
    private String courseCode;
    private String courseName;
    private String courseNameEn;
    private BigDecimal credits;
    private String courseType;
    private BigDecimal theoryHours;
    private BigDecimal practiceHours;
    private BigDecimal selfStudyHours;
    private String departmentName;
    private Boolean isActive;
}
