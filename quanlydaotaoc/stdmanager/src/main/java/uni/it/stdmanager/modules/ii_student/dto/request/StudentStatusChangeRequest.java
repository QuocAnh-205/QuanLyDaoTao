package uni.it.stdmanager.modules.ii_student.dto.request;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentStatusChangeRequest {
    private String statusCode; // ACTIVE, RESERVED, DROPPED, GRADUATED
    private String statusName;
    private LocalDate startDate;
    private String description;
    private String reason;
}
