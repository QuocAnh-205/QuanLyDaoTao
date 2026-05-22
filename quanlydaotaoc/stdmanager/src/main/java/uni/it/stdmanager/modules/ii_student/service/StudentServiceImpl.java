// 2. StudentServiceImpl.java
package uni.it.stdmanager.modules.ii_student.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// import uni.it.stdmanager.core.exception.AppException;
// import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.i_auth.entity.Role;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.repository.RoleRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentCreationRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentSearchRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentStatusChangeRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentUpdateRequest;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentStatusResponse;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.entity.StudentClass;
import uni.it.stdmanager.modules.ii_student.entity.StudentStatus;
import uni.it.stdmanager.modules.ii_student.repository.StudentClassRepository;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.ii_student.repository.StudentStatusRepository;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.v_semester.repository.StudentCourseSectionRepository;
import uni.it.stdmanager.modules.vii_tuition.repository.StudentTuitionRepository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.v_semester.entity.StudentCourseSection;
import uni.it.stdmanager.modules.vii_tuition.entity.StudentTuition;

import org.springframework.data.domain.Sort;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentClassRepository studentClassRepository;
    private final StudentStatusRepository studentStatusRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final StudentCourseSectionRepository studentCourseSectionRepository;
    private final StudentTuitionRepository studentTuitionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<StudentResponse> searchStudents(StudentSearchRequest request) {
        Sort sort = request.getSortDir().equalsIgnoreCase("asc")
                ? Sort.by(request.getSortBy()).ascending()
                : Sort.by(request.getSortBy()).descending();

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        Page<Student> students = studentRepository.searchStudents(
                request.getKeyword(), request.getClassId(), request.getStatusId(), pageable);
        return students.map(this::mapToResponse);
    }

    @Override
    public StudentResponse getStudentById(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        return mapToResponse(student);
    }

    @Override
    public StudentResponse createStudent(StudentCreationRequest request) {
        if (studentRepository.existsByStudentCode(request.getStudentCode())) {
            throw new RuntimeException("Mã sinh viên đã tồn tại");
        }

        StudentClass studentClass = studentClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp hành chính"));

        // 1. Tạo tài khoản User cho sinh viên (Mặc định pass là mã SV)
        User user = User.builder()
                .username(request.getStudentCode())
                .passwordHash(passwordEncoder.encode(request.getStudentCode()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        user = userRepository.save(user);

        // 2. Gán Role SINHVIEN
        Role role = roleRepository.findByCode("SINHVIEN")
                .orElseThrow(() -> new RuntimeException("Lỗi cấu hình Role"));
        userRoleRepository.save(UserRole.builder().user(user).role(role).build());

        // 3. Tạo hồ sơ Student
        Student student = Student.builder()
                .user(user)
                .studentCode(request.getStudentCode())
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .personalIdentificationNumber(request.getPersonalIdentificationNumber())
                .dateOfIssue(request.getDateOfIssue())
                .cardPlace(request.getCardPlace())
                .address(request.getAddress())
                .currentAddress(request.getCurrentAddress())
                .studentClass(studentClass)
                .admissionYear(calculateAdmissionYear(request.getStudentCode()))
                // Giả định Major & Department lấy từ Class
                .major(studentClass.getMajor())
                .department(studentClass.getDepartment())
                .build();
        student = studentRepository.save(student);

        // 4. Khởi tạo trạng thái Đang học
        StudentStatus status = StudentStatus.builder()
                .student(student)
                .statusCode("ACTIVE")
                .statusName("Đang học")
                .startDate(LocalDate.now())
                .build();
        studentStatusRepository.save(status);

        student.setCurrentStatus(status);
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    public StudentResponse updateStudent(UUID id, StudentUpdateRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        if (request.getFullName() != null)
            student.setFullName(request.getFullName());
        if (request.getDateOfBirth() != null)
            student.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null)
            student.setGender(request.getGender());
        if (request.getPhone() != null)
            student.getUser().setPhone(request.getPhone());
        if (request.getEmail() != null)
            student.getUser().setEmail(request.getEmail());
        if (request.getPersonalIdentificationNumber() != null)
            student.setPersonalIdentificationNumber(request.getPersonalIdentificationNumber());
        if (request.getDateOfIssue() != null)
            student.setDateOfIssue(request.getDateOfIssue());
        if (request.getCardPlace() != null)
            student.setCardPlace(request.getCardPlace());
        if (request.getAddress() != null)
            student.setAddress(request.getAddress());
        if (request.getCurrentAddress() != null)
            student.setCurrentAddress(request.getCurrentAddress());

        if (request.getClassId() != null) {
            StudentClass studentClass = studentClassRepository.findById(request.getClassId())
                    .orElseThrow(() -> new RuntimeException("Lớp không tồn tại"));
            student.setStudentClass(studentClass);
        }

        return mapToResponse(studentRepository.save(student));
    }

    @Override
    public StudentResponse changeStatus(UUID id, StudentStatusChangeRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : LocalDate.now();

        // 1. Đóng trạng thái hiện tại (nếu có)
        StudentStatus currentStatus = student.getCurrentStatus();
        if (currentStatus != null) {
            // Ngày kết thúc của trạng thái cũ là ngày trước ngày bắt đầu trạng thái mới
            currentStatus.setEndDate(startDate.minusDays(1));
            studentStatusRepository.save(currentStatus);
        }

        // 2. Tạo trạng thái mới (Lưu vào lịch sử)
        StudentStatus newStatus = StudentStatus.builder()
                .student(student)
                .statusCode(request.getStatusCode())
                .statusName(request.getStatusName())
                .startDate(startDate)
                .reason(request.getReason())
                .description(request.getDescription())
                .build();
        studentStatusRepository.save(newStatus);

        // 3. Cập nhật trạng thái hiện tại cho sinh viên
        student.setCurrentStatus(newStatus);
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    public List<StudentStatusResponse> getStatusHistory(UUID id) {
        return studentStatusRepository.findAllByStudentIdOrderByStartDateDesc(id).stream()
                .map(status -> StudentStatusResponse.builder()
                        .id(status.getId())
                        .statusCode(status.getStatusCode())
                        .statusName(status.getStatusName())
                        .startDate(status.getStartDate())
                        .endDate(status.getEndDate())
                        .reason(status.getReason())
                        .description(status.getDescription())
                        .createdAt(status.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .email(student.getUser().getEmail())
                .phone(student.getUser().getPhone())
                .personalIdentificationNumber(student.getPersonalIdentificationNumber())
                .dateOfIssue(student.getDateOfIssue())
                .cardPlace(student.getCardPlace())
                .address(student.getAddress())
                .currentAddress(student.getCurrentAddress())
                .classId(student.getStudentClass() != null ? student.getStudentClass().getId() : null)
                .className(student.getStudentClass() != null ? student.getStudentClass().getClassName() : null)
                .majorId(student.getMajor() != null ? student.getMajor().getId() : null)
                .majorName(student.getMajor() != null ? student.getMajor().getMajorName() : null)
                .departmentId(student.getDepartment() != null ? student.getDepartment().getId() : null)
                .departmentName(student.getDepartment() != null ? student.getDepartment().getDepartmentName() : null)
                .statusName(student.getCurrentStatus() != null ? student.getCurrentStatus().getStatusName() : null)
                .statusCode(student.getCurrentStatus() != null ? student.getCurrentStatus().getStatusCode() : null)
                .admissionYear(student.getAdmissionYear() != null ? student.getAdmissionYear()
                        : calculateAdmissionYear(student.getStudentCode()))
                .build();
    }

    private Integer calculateAdmissionYear(String studentCode) {
        if (studentCode == null || studentCode.length() < 6)
            return null;
        // Example: SV2026111 -> 2026
        try {
            String yearStr = studentCode.replaceAll("[^0-9]", "");
            if (yearStr.length() >= 4) {
                return Integer.parseInt(yearStr.substring(0, 4));
            }
        } catch (Exception e) {
            // fallback
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteStudent(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // 1. Clear current status to prevent circular foreign key constraints
        student.setCurrentStatus(null);
        studentRepository.saveAndFlush(student);

        // 2. Clear unmapped child constraints via native SQL to prevent FK violations
        // 2.1 Delete payments referencing student's tuitions
        entityManager.createNativeQuery(
            "DELETE FROM payments WHERE tuition_id IN (SELECT id FROM student_tuition WHERE student_id = :studentId)"
        ).setParameter("studentId", id).executeUpdate();

        // 2.2 Delete student component grades referencing student's course registrations
        entityManager.createNativeQuery(
            "DELETE FROM student_component_grades WHERE registration_id IN (SELECT id FROM course_registrations WHERE student_id = :studentId)"
        ).setParameter("studentId", id).executeUpdate();

        // 2.3 Delete student summaries referencing student's course registrations
        entityManager.createNativeQuery(
            "DELETE FROM student_summaries WHERE registration_id IN (SELECT id FROM course_registrations WHERE student_id = :studentId)"
        ).setParameter("studentId", id).executeUpdate();

        // 3. Delete Course Registrations
        List<CourseRegistration> registrations = courseRegistrationRepository.findAllByStudentId(id);
        courseRegistrationRepository.deleteAll(registrations);

        // 4. Delete Student Course Sections
        List<StudentCourseSection> sections = studentCourseSectionRepository.findAllByStudentId(id);
        studentCourseSectionRepository.deleteAll(sections);

        // 5. Delete Student Tuitions
        List<StudentTuition> tuitions = studentTuitionRepository.findAllByStudentId(id);
        studentTuitionRepository.deleteAll(tuitions);

        // 6. Delete Student Status records (History)
        List<StudentStatus> statuses = studentStatusRepository.findAllByStudentIdOrderByStartDateDesc(id);
        studentStatusRepository.deleteAll(statuses);

        // 7. Keep reference to User before deleting Student
        User user = student.getUser();

        // 8. Delete Student
        studentRepository.delete(student);

        // 9. Delete User Role mappings, User notifications, and User account
        if (user != null) {
            userRoleRepository.deleteAllByUser(user);
            
            // Delete user notifications referencing the user
            entityManager.createNativeQuery(
                "DELETE FROM user_notifications WHERE user_id = :userId"
            ).setParameter("userId", user.getId()).executeUpdate();
            
            userRepository.delete(user);
        }
    }
}