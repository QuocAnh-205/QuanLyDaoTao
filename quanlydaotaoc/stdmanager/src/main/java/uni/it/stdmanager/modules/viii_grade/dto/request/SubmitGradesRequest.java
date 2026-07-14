package uni.it.stdmanager.modules.viii_grade.dto.request;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitGradesRequest {
    private UUID registrationId;
    private List<StudentComponentGradeInput> grades;
}
