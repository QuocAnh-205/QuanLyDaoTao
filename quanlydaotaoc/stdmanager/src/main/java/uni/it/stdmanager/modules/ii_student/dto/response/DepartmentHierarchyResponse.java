package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentHierarchyResponse {
    private UUID id;
    private String departmentName;
    private String departmentCode;
    private List<MajorHierarchyResponse> majors;
}
