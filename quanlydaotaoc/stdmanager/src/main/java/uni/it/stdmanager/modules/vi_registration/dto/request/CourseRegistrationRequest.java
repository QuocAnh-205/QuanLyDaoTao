package uni.it.stdmanager.modules.vi_registration.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRegistrationRequest {

    @NotNull(message = "ID sinh viên không được để trống")
    private UUID studentId;

    @NotNull(message = "ID lớp học phần không được để trống")
    private UUID courseSectionId;

    @NotNull(message = "ID đợt đăng ký không được để trống")
    private UUID registrationPeriodId;

    @NotNull(message = "Loại đăng ký không được để trống")
    private Integer registrationType; // 1: Học mới; 2: Học lại; 3: Cải thiện

    private UUID replacedGradeId;
}
