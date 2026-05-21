package uni.it.stdmanager.modules.vi_registration.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquivalentCourseResponse {
    private UUID id;
    private UUID originalCourseId;
    private String originalCourseName;
    private UUID equivalentCourseId;
    private String equivalentCourseName;
    private Integer equivalenceType;
    private LocalDate effectDate;
    private String note;
    private Boolean isActive;
}
