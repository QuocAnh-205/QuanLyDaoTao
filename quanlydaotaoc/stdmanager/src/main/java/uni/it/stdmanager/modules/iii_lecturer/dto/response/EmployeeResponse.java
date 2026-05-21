package uni.it.stdmanager.modules.iii_lecturer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private UUID id;
    private String employeeCode;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;
    private String phone;
    private String address;
    private LocalDate hireDate;
    private String contractType;
    private BigDecimal salaryCoefficient;
    private String academicDegree;
    private String academicTitle;
    private String specialization;

    // Relational info
    private UUID departmentId;
    private String departmentName;
    private UUID positionId;
    private String positionName;
}
