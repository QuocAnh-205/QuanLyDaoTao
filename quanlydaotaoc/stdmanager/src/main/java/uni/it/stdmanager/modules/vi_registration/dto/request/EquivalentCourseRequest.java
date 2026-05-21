package uni.it.stdmanager.modules.vi_registration.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquivalentCourseRequest {

    @NotNull(message = "ID môn học gốc không được để trống")
    private UUID originalCourseId;

    @NotNull(message = "ID môn học tương đương không được để trống")
    private UUID equivalentCourseId;

    @NotNull(message = "Loại tương đương không được để trống")
    private Integer equivalenceType;

    private LocalDate effectDate;

    private String note;
}
