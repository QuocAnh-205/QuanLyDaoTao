package uni.it.stdmanager.modules.v_semester.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterRequest {
    @NotBlank(message = "Mã học kỳ không được để trống")
    private String semesterCode;

    @NotBlank(message = "Tên học kỳ không được để trống")
    private String semesterName;

    @NotBlank(message = "Năm học không được để trống")
    private String academicYear;

    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
}
