package uni.it.stdmanager.modules.iv_course.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    @NotBlank(message = "Mã môn học không được để trống")
    @Size(max = 20, message = "Mã môn học tối đa 20 ký tự")
    private String courseCode;

    @NotBlank(message = "Tên môn học không được để trống")
    @Size(max = 255, message = "Tên môn học tối đa 255 ký tự")
    private String courseName;

    private String courseNameEn;

    @NotNull(message = "Số tín chỉ không được để trống")
    @DecimalMin(value = "0.0", message = "Số tín chỉ không được nhỏ hơn 0")
    private BigDecimal credits;

    @NotBlank(message = "Loại môn học không được để trống")
    private String courseType;

    private BigDecimal theoryHours;
    private BigDecimal practiceHours;
    private BigDecimal selfStudyHours;
    private UUID departmentId;
}
