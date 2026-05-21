package uni.it.stdmanager.modules.vi_registration.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationPeriodResponse {
    private UUID id;
    private String name;
    private UUID semesterId;
    private String semesterName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String targetConfig;
    private Integer maxCredits;
    private Integer minCredits;
    private Boolean allowRetake;
    private Boolean isActive;
}
