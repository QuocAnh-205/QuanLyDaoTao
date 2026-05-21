package uni.it.stdmanager.modules.iii_lecturer.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class EmployeeRequest {
    @NotBlank(message = "Mã nhân viên không được để trống")
    private String employeeCode;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private LocalDate dateOfBirth;
    private String gender;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String phone;
    private String address;

    private LocalDate hireDate;
    private String contractType;
    private BigDecimal salaryCoefficient;
    private String academicDegree;
    private String academicTitle;
    private String specialization;

    private UUID departmentId;
    private UUID positionId;
}
