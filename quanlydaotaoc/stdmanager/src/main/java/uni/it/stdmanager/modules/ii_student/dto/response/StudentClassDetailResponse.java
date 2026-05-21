package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassDetailResponse {
    private UUID id;
    private String classCode;
    private String className;
    private String courseYear;
    private String majorName;
    private String departmentName;
    private String advisorName;
    private List<StudentResponse> students;
}
