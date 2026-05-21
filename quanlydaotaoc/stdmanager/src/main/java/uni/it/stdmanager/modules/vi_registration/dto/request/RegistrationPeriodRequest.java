package uni.it.stdmanager.modules.vi_registration.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationPeriodRequest {

    @NotBlank(message = "Tên đợt đăng ký không được để trống")
    private String name;

    @NotNull(message = "ID học kỳ không được để trống")
    private UUID semesterId;

    @NotNull(message = "Thời điểm bắt đầu không được để trống")
    private LocalDateTime startTime;

    @NotNull(message = "Thời điểm kết thúc không được để trống")
    private LocalDateTime endTime;

    private String targetConfig;

    @jakarta.validation.constraints.Min(value = 1, message = "Số tín chỉ tối đa phải ít nhất là 1")
    @jakarta.validation.constraints.Max(value = 50, message = "Số tín chỉ tối đa không quá 50")
    private Integer maxCredits;

    @jakarta.validation.constraints.Min(value = 0, message = "Số tín chỉ tối thiểu không được âm")
    private Integer minCredits;

    private Boolean allowRetake;
}
