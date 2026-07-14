package uni.it.stdmanager.modules.vi_registration.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.Role;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.RoleRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.entity.StudentClass;
import uni.it.stdmanager.modules.ii_student.entity.StudentStatus;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.ii_student.repository.StudentClassRepository;
import uni.it.stdmanager.modules.ii_student.repository.StudentStatusRepository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;
import uni.it.stdmanager.modules.vi_registration.dto.request.CourseRegistrationRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.CourseRegistrationResponse;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.entity.RegistrationPeriod;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.vi_registration.repository.RegistrationPeriodRepository;
import uni.it.stdmanager.modules.vi_registration.service.CourseRegistrationService;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseRegistrationServiceImpl implements CourseRegistrationService {

        private final CourseRegistrationRepository courseRegistrationRepository;
        private final RegistrationPeriodRepository registrationPeriodRepository;
        private final StudentRepository studentRepository;
        private final CourseSectionRepository courseSectionRepository;
        private final StudentClassRepository studentClassRepository;
        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final UserRoleRepository userRoleRepository;
        private final StudentStatusRepository studentStatusRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public CourseRegistrationResponse register(CourseRegistrationRequest request) {
                // 1. Kiểm tra đợt đăng ký
                RegistrationPeriod period = registrationPeriodRepository.findById(request.getRegistrationPeriodId())
                                .orElseThrow(() -> new AppException(ErrorCode.REGISTRATION_PERIOD_NOT_FOUND));

                LocalDateTime now = LocalDateTime.now();
                if (now.isBefore(period.getStartTime()) || now.isAfter(period.getEndTime())) {
                        throw new AppException(ErrorCode.REGISTRATION_PERIOD_CLOSED);
                }

                // 2. Kiểm tra sinh viên
                Student student = studentRepository.findById(request.getStudentId())
                                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_FOUND));

                // 3. Kiểm tra lớp học phần
                CourseSection section = courseSectionRepository.findById(request.getCourseSectionId())
                                .orElseThrow(() -> new AppException(ErrorCode.COURSE_SECTION_NOT_FOUND));

                // 4. Kiểm tra sĩ số
                long currentEnrolled = courseRegistrationRepository.countByCourseSectionIdAndStatus(section.getId(), 1); // Status
                                                                                                                         // 1:
                                                                                                                         // Success
                if (section.getMaxStudents() != null && currentEnrolled >= section.getMaxStudents()) {
                        throw new AppException(ErrorCode.COURSE_SECTION_FULL);
                }

                // 5. Kiểm tra đăng ký trùng (nếu đã đăng ký thành công lớp này rồi)
                if (courseRegistrationRepository.existsByStudentIdAndCourseSectionIdAndStatusIn(
                                student.getId(), section.getId(), Arrays.asList(1, 2))) { // 1: Success, 2: Pending
                                                                                          // payment
                        throw new RuntimeException("Bạn đã đăng ký lớp học phần này rồi");
                }

                // 6. Kiểm tra giới hạn tín chỉ
                List<CourseRegistration> currentRegistrations = courseRegistrationRepository
                                .findAllByStudentIdAndCourseSectionSemesterId(student.getId(),
                                                section.getSemester().getId());

                double totalCredits = currentRegistrations.stream()
                                .filter(r -> r.getStatus() == 1 || r.getStatus() == 2)
                                .mapToDouble(r -> r.getCourseSection().getCourse().getCredits().doubleValue())
                                .sum();

                double newCourseCredits = section.getCourse().getCredits().doubleValue();
                if (period.getMaxCredits() != null && (totalCredits + newCourseCredits) > period.getMaxCredits()) {
                        throw new AppException(ErrorCode.CREDIT_LIMIT_EXCEEDED);
                }

                // 7. Lưu đăng ký
                CourseRegistration registration = CourseRegistration.builder()
                                .student(student)
                                .courseSection(section)
                                .registrationPeriod(period)
                                .registrationType(request.getRegistrationType())
                                .replacedGradeId(request.getReplacedGradeId())
                                .registeredAt(now)
                                .status(1) // Mặc định thành công cho demo
                                .isPaid(false)
                                .build();

                return mapToResponse(courseRegistrationRepository.save(registration));
        }

        @Override
        @Transactional
        public void cancel(UUID id) {
                CourseRegistration registration = courseRegistrationRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin đăng ký"));

                // Kiểm tra xem đợt đăng ký còn mở không
                LocalDateTime now = LocalDateTime.now();
                if (now.isAfter(registration.getRegistrationPeriod().getEndTime())) {
                        throw new RuntimeException("Hết thời gian đăng ký, không thể hủy");
                }

                registration.setStatus(3); // 3: Đã hủy
                registration.setIsActive(false);
                courseRegistrationRepository.save(registration);
        }

        @Override
        public List<CourseRegistrationResponse> getByStudent(UUID studentId) {
                return courseRegistrationRepository.findAllByStudentId(studentId).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<CourseRegistrationResponse> getBySection(UUID sectionId) {
                return courseRegistrationRepository.findAllByCourseSectionId(sectionId).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public CourseRegistrationResponse adminEnroll(UUID studentId, UUID courseSectionId) {
                Student student = studentRepository.findById(studentId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

                CourseSection section = courseSectionRepository.findById(courseSectionId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần"));

                if (courseRegistrationRepository.existsByStudentIdAndCourseSectionIdAndStatusIn(
                                student.getId(), section.getId(), java.util.Arrays.asList(1, 2))) {
                        throw new RuntimeException("Sinh viên đã được đăng ký vào lớp học phần này");
                }

                RegistrationPeriod period = registrationPeriodRepository.findAll().stream()
                                .filter(p -> p.getSemester().getId().equals(section.getSemester().getId()))
                                .findFirst()
                                .orElseGet(() -> {
                                        RegistrationPeriod newPeriod = RegistrationPeriod.builder()
                                                        .name("Đợt đăng ký thủ công của lớp " + section.getClassCode())
                                                        .semester(section.getSemester())
                                                        .startTime(java.time.LocalDateTime.now().minusDays(10))
                                                        .endTime(java.time.LocalDateTime.now().plusYears(1))
                                                        .build();
                                        return registrationPeriodRepository.save(newPeriod);
                                });

                CourseRegistration registration = CourseRegistration.builder()
                                .student(student)
                                .courseSection(section)
                                .registrationPeriod(period)
                                .registrationType(1)
                                .registeredAt(java.time.LocalDateTime.now())
                                .status(1)
                                .isPaid(false)
                                .build();

                return mapToResponse(courseRegistrationRepository.save(registration));
        }

        @Override
        @Transactional
        public CourseRegistrationResponse adminEnrollByInfo(String studentCode, String fullName, UUID courseSectionId) {
                CourseSection section = courseSectionRepository.findById(courseSectionId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần"));

                Student student = studentRepository.findByStudentCode(studentCode)
                                .orElseGet(() -> {
                                        User user = User.builder()
                                                        .username(studentCode)
                                                        .passwordHash(passwordEncoder.encode("Admin@123"))
                                                        .fullName(fullName)
                                                        .build();
                                        user = userRepository.save(user);

                                        Role role = roleRepository.findByCode("SINHVIEN")
                                                        .orElseThrow(() -> new RuntimeException("Lỗi cấu hình Role"));
                                        userRoleRepository.save(UserRole.builder().user(user).role(role).build());

                                        StudentClass studentClass = studentClassRepository.findAll().stream()
                                                        .findFirst()
                                                        .orElseThrow(() -> new RuntimeException("Chưa cấu hình bất kỳ lớp hành chính nào trên hệ thống. Hãy tạo lớp hành chính trước."));

                                        Student newStudent = Student.builder()
                                                        .user(user)
                                                        .studentCode(studentCode)
                                                        .fullName(fullName)
                                                        .dateOfBirth(java.time.LocalDate.of(2000, 1, 1))
                                                        .studentClass(studentClass)
                                                        .admissionYear(2024)
                                                        .major(studentClass.getMajor())
                                                        .department(studentClass.getDepartment())
                                                        .build();
                                        newStudent = studentRepository.save(newStudent);

                                        StudentStatus status = StudentStatus.builder()
                                                        .student(newStudent)
                                                        .statusCode("ACTIVE")
                                                        .statusName("Đang học")
                                                        .startDate(java.time.LocalDate.now())
                                                        .build();
                                        status = studentStatusRepository.save(status);

                                        newStudent.setCurrentStatus(status);
                                        newStudent = studentRepository.save(newStudent);

                                        return newStudent;
                                });

                if (courseRegistrationRepository.existsByStudentIdAndCourseSectionIdAndStatusIn(
                                student.getId(), section.getId(), java.util.Arrays.asList(1, 2))) {
                        throw new RuntimeException("Sinh viên đã được đăng ký vào lớp học phần này");
                }

                RegistrationPeriod period = registrationPeriodRepository.findAll().stream()
                                .filter(p -> p.getSemester().getId().equals(section.getSemester().getId()))
                                .findFirst()
                                .orElseGet(() -> {
                                        RegistrationPeriod newPeriod = RegistrationPeriod.builder()
                                                        .name("Đợt đăng ký thủ công của lớp " + section.getClassCode())
                                                        .semester(section.getSemester())
                                                        .startTime(java.time.LocalDateTime.now().minusDays(10))
                                                        .endTime(java.time.LocalDateTime.now().plusYears(1))
                                                        .build();
                                        return registrationPeriodRepository.save(newPeriod);
                                });

                CourseRegistration registration = CourseRegistration.builder()
                                .student(student)
                                .courseSection(section)
                                .registrationPeriod(period)
                                .registrationType(1)
                                .registeredAt(java.time.LocalDateTime.now())
                                .status(1)
                                .isPaid(false)
                                .build();

                return mapToResponse(courseRegistrationRepository.save(registration));
        }

        private CourseRegistrationResponse mapToResponse(CourseRegistration registration) {
                return CourseRegistrationResponse.builder()
                                .id(registration.getId())
                                .studentId(registration.getStudent().getId())
                                .studentName(registration.getStudent().getFullName())
                                .courseSectionId(registration.getCourseSection().getId())
                                .courseSectionCode(registration.getCourseSection().getClassCode())
                                .courseName(registration.getCourseSection().getCourse().getCourseName())
                                .registrationPeriodId(registration.getRegistrationPeriod() != null ? registration.getRegistrationPeriod().getId() : null)
                                .registrationType(registration.getRegistrationType())
                                .registeredAt(registration.getRegisteredAt())
                                .status(registration.getStatus())
                                .isPaid(registration.getIsPaid())
                                .build();
        }
}
