package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MajorHierarchyResponse {
    private UUID id;
    private String majorName;
    private String majorCode;
    private List<StudentClassResponse> classes;
}
