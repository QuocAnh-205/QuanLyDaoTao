package uni.it.stdmanager.modules.iv_course.dto.response;

import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MajorResponse {
    private UUID id;
    private String majorCode;
    private String majorName;
    private String departmentName;
    private String description;
}
