package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentStatusResponse {
    private UUID id;
    private String statusCode;
    private String statusName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String reason;
    private LocalDateTime createdAt;
}
