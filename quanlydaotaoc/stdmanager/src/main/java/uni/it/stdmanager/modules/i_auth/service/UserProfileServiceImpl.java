package uni.it.stdmanager.modules.i_auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.security.SecurityUtils;
import uni.it.stdmanager.modules.i_auth.dto.response.UserProfileResponse;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.iii_lecturer.repository.EmployeeRepository;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public UserProfileResponse getCurrentUserProfile() {
        // 1. Lấy username từ SecurityContext
        String currentUsername = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xác thực"));

        // 2. Tìm User entity
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + currentUsername));

        // 3. Lấy danh sách roles
        Set<String> roles = userRoleRepository.findAllByUser(user).stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        // 4. Build response cơ bản từ User
        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .lastLoginAt(user.getLastLoginAt())
                .roles(roles);

        // 5. Kiểm tra và gắn hồ sơ liên kết (Student hoặc Employee)
        Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
        if (studentOpt.isPresent()) {
            builder.profileType("STUDENT");
            builder.studentProfile(mapStudentProfile(studentOpt.get()));
        } else {
            Optional<Employee> employeeOpt = employeeRepository.findByUserId(user.getId());
            if (employeeOpt.isPresent()) {
                builder.profileType("EMPLOYEE");
                builder.employeeProfile(mapEmployeeProfile(employeeOpt.get()));
            }
        }

        return builder.build();
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(uni.it.stdmanager.modules.i_auth.dto.request.ProfileUpdateRequest request) {
        String currentUsername = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xác thực"));

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + currentUsername));

        Set<String> roles = userRoleRepository.findAllByUser(user).stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        boolean canEditSensitiveInfo = roles.contains("ADMIN") || roles.contains("GIAOVU");

        // Cập nhật User
        if (canEditSensitiveInfo) {
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
        }
        user.setPhone(request.getPhone());
        userRepository.save(user);

        // Đồng bộ với hồ sơ liên kết (nếu có)
        studentRepository.findByUserId(user.getId()).ifPresent(student -> {
            if (canEditSensitiveInfo) {
                student.setFullName(request.getFullName());
                studentRepository.save(student);
            }
        });

        employeeRepository.findByUserId(user.getId()).ifPresent(employee -> {
            if (canEditSensitiveInfo) {
                employee.setFullName(request.getFullName());
                employee.setEmail(request.getEmail());
            }
            employee.setPhone(request.getPhone());
            employeeRepository.save(employee);
        });

        return getCurrentUserProfile();
    }

    @Override
    @Transactional
    public String updateAvatar(org.springframework.web.multipart.MultipartFile file) {
        String currentUsername = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xác thực"));

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + currentUsername));

        if (file.isEmpty()) {
            throw new RuntimeException("File trống");
        }

        try {
            // Trong thực tế nên dùng một Service lưu trữ chuyên dụng (S3, Cloudinary, hoặc File System)
            // Ở đây tôi giả lập lưu vào thư mục static của dự án hoặc trả về một URL giả lập
            // Giả sử ta lưu local:
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            // Lưu path vào user (trong thực tế path này nên được cấu hình)
            String avatarUrl = "/uploads/avatars/" + fileName;
            
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);

            return avatarUrl;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu file: " + e.getMessage());
        }
    }

    private UserProfileResponse.StudentProfile mapStudentProfile(Student student) {
        return UserProfileResponse.StudentProfile.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .personalIdentificationNumber(student.getPersonalIdentificationNumber())
                .address(student.getAddress())
                .currentAddress(student.getCurrentAddress())
                .className(student.getStudentClass() != null ? student.getStudentClass().getClassName() : null)
                .departmentName(student.getDepartment() != null ? student.getDepartment().getDepartmentName() : null)
                .majorName(student.getMajor() != null ? student.getMajor().getMajorName() : null)
                .programName(student.getProgram() != null ? student.getProgram().getProgramName() : null)
                .statusName(student.getCurrentStatus() != null ? student.getCurrentStatus().getStatusName() : null)
                .admissionYear(student.getAdmissionYear())
                .build();
    }

    private UserProfileResponse.EmployeeProfile mapEmployeeProfile(Employee employee) {
        return UserProfileResponse.EmployeeProfile.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .fullName(employee.getFullName())
                .dateOfBirth(employee.getDateOfBirth())
                .gender(employee.getGender())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : null)
                .positionName(employee.getPosition() != null ? employee.getPosition().getName() : null)
                .hireDate(employee.getHireDate())
                .contractType(employee.getContractType())
                .academicDegree(employee.getAcademicDegree())
                .academicTitle(employee.getAcademicTitle())
                .specialization(employee.getSpecialization())
                .build();
    }
}
