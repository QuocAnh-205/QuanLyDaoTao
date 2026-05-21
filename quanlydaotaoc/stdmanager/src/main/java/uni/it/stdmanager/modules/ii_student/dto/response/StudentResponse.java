package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private UUID id;
    private String studentCode;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;
    private String phone;
    private String personalIdentificationNumber;
    private LocalDate dateOfIssue;
    private String cardPlace;
    private String address;
    private String currentAddress;

    // Thông tin định danh liên kết
    private UUID classId;
    private String className;
    private UUID majorId;
    private String majorName;
    private UUID departmentId;
    private String departmentName;
    private String statusName;
    private String statusCode;
    private Integer admissionYear;
}