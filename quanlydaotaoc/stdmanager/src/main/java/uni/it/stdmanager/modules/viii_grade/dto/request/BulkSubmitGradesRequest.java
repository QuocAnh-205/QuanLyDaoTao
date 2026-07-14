package uni.it.stdmanager.modules.viii_grade.dto.request;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkSubmitGradesRequest {
    private List<SubmitGradesRequest> submissions;
    @Builder.Default
    private Boolean finalize = false;
}
