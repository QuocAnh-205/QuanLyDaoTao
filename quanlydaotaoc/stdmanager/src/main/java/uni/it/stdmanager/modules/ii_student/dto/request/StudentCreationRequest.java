package uni.it.stdmanager.modules.ii_student.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCreationRequest {
    @NotBlank(message = "Mã sinh viên không được để trống")
    private String studentCode;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate dateOfBirth;

    private String gender;

    private String personalIdentificationNumber;
    private LocalDate dateOfIssue;
    private String cardPlace;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String phone;
    private String address;
    private String currentAddress;

    @NotNull(message = "Cần có ID lớp hành chính")
    private UUID classId;

    private UUID majorId;
    private UUID programId;
}