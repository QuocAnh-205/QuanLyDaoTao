package uni.it.stdmanager.modules.v_semester.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionRequest {
    @NotBlank(message = "Mã lớp học phần không được để trống")
    private String classCode;

    @NotNull(message = "ID môn học không được để trống")
    private UUID courseId;

    @NotNull(message = "ID học kỳ không được để trống")
    private UUID semesterId;

    private UUID lecturerId;
    private UUID roomId;
    private UUID buildingId;
    
    @Min(value = 1, message = "Sĩ số tối đa phải ít nhất là 1")
    private Integer maxStudents;
    
    private Integer minStudents;
    private String classType;
    private String status;
    private LocalDateTime registrationStart;
    private LocalDateTime registrationEnd;
    private String note;
}
