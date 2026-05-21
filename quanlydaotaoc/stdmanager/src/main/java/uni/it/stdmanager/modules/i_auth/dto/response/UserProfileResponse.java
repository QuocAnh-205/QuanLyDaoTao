package uni.it.stdmanager.modules.i_auth.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

/**
 * DTO trả về đầy đủ thông tin profile người dùng đang đăng nhập.
 * Bao gồm: thông tin tài khoản, vai trò, và hồ sơ liên kết (Sinh viên hoặc Cán bộ).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    // --- Thông tin tài khoản (User) ---
    private UUID userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private LocalDateTime lastLoginAt;
    private Set<String> roles;

    // --- Loại hồ sơ liên kết ---
    private String profileType; // "STUDENT", "EMPLOYEE", hoặc null

    // --- Hồ sơ Sinh viên (nếu có) ---
    private StudentProfile studentProfile;

    // --- Hồ sơ Cán bộ / Giảng viên (nếu có) ---
    private EmployeeProfile employeeProfile;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentProfile {
        private UUID id;
        private String studentCode;
        private String fullName;
        private LocalDate dateOfBirth;
        private String gender;
        private String personalIdentificationNumber;
        private String address;
        private String currentAddress;
        private String className;
        private String departmentName;
        private String majorName;
        private String programName;
        private String statusName;
        private Integer admissionYear;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeProfile {
        private UUID id;
        private String employeeCode;
        private String fullName;
        private LocalDate dateOfBirth;
        private String gender;
        private String email;
        private String phone;
        private String address;
        private String departmentName;
        private String positionName;
        private LocalDate hireDate;
        private String contractType;
        private String academicDegree;
        private String academicTitle;
        private String specialization;
    }
}
