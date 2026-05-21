package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassResponse {
    private UUID id;
    private String classCode;
    private String className;
    private String courseYear;
    private String majorName;
    private Integer studentCount; // Số lượng sinh viên trong lớp (tùy chọn)
}