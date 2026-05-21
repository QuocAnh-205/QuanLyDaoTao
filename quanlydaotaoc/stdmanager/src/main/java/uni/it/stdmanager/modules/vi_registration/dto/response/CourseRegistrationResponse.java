package uni.it.stdmanager.modules.vi_registration.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRegistrationResponse {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private UUID courseSectionId;
    private String courseSectionCode;
    private String courseName;
    private UUID registrationPeriodId;
    private Integer registrationType;
    private LocalDateTime registeredAt;
    private Integer status;
    private Boolean isPaid;
}
