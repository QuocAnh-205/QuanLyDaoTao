package uni.it.stdmanager.modules.iv_course.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iii_lecturer.repository.DepartmentRepository;
import uni.it.stdmanager.modules.iv_course.dto.request.CourseRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.CourseResponse;
import uni.it.stdmanager.modules.iv_course.entity.Course;
import uni.it.stdmanager.modules.iv_course.repository.CourseRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học với ID: " + id));
        return mapToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.findByCourseCode(request.getCourseCode()).isPresent()) {
            throw new RuntimeException("Mã môn học đã tồn tại: " + request.getCourseCode());
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
        }

        Course course = Course.builder()
                .courseCode(request.getCourseCode())
                .courseName(request.getCourseName())
                .courseNameEn(request.getCourseNameEn())
                .credits(request.getCredits())
                .courseType(request.getCourseType())
                .theoryHours(request.getTheoryHours())
                .practiceHours(request.getPracticeHours())
                .selfStudyHours(request.getSelfStudyHours())
                .department(department)
                .build();

        return mapToResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(UUID id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học với ID: " + id));

        // Kiểm tra mã môn học nếu thay đổi
        if (!course.getCourseCode().equals(request.getCourseCode()) && 
            courseRepository.findByCourseCode(request.getCourseCode()).isPresent()) {
            throw new RuntimeException("Mã môn học đã tồn tại: " + request.getCourseCode());
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
        }

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setCourseNameEn(request.getCourseNameEn());
        course.setCredits(request.getCredits());
        course.setCourseType(request.getCourseType());
        course.setTheoryHours(request.getTheoryHours());
        course.setPracticeHours(request.getPracticeHours());
        course.setSelfStudyHours(request.getSelfStudyHours());
        course.setDepartment(department);

        return mapToResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học với ID: " + id));
        // Xóa mềm: set is_active = false hoặc xóa hẳn tùy logic dự án. 
        // Ở đây tôi xóa hẳn để đơn giản, trong thực tế thường dùng xóa mềm.
        courseRepository.delete(course);
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .courseNameEn(course.getCourseNameEn())
                .credits(course.getCredits())
                .courseType(course.getCourseType())
                .theoryHours(course.getTheoryHours())
                .practiceHours(course.getPracticeHours())
                .selfStudyHours(course.getSelfStudyHours())
                .departmentName(course.getDepartment() != null ? course.getDepartment().getDepartmentName() : null)
                .isActive(course.getIsActive())
                .build();
    }
}
