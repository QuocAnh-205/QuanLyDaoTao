package uni.it.stdmanager.modules.v_semester.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.iii_lecturer.repository.EmployeeRepository;
import uni.it.stdmanager.modules.iv_course.entity.Course;
import uni.it.stdmanager.modules.iv_course.repository.CourseRepository;
import uni.it.stdmanager.modules.v_semester.dto.request.CourseSectionRequest;
import uni.it.stdmanager.modules.v_semester.dto.response.CourseSectionResponse;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.entity.Semester;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;
import uni.it.stdmanager.modules.v_semester.repository.SemesterRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseSectionServiceImpl implements CourseSectionService {

    private final CourseSectionRepository courseSectionRepository;
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public List<CourseSectionResponse> getSectionsBySemester(UUID semesterId) {
        return courseSectionRepository.findAllBySemesterId(semesterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseSectionResponse getSectionById(UUID id) {
        CourseSection section = courseSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần với ID: " + id));
        return mapToResponse(section);
    }

    @Override
    @Transactional
    public CourseSectionResponse createSection(CourseSectionRequest request) {
        if (courseSectionRepository.findByClassCode(request.getClassCode()).isPresent()) {
            throw new RuntimeException("Mã lớp học phần đã tồn tại: " + request.getClassCode());
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học với ID: " + request.getCourseId()));
        
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ với ID: " + request.getSemesterId()));

        Employee lecturer = null;
        if (request.getLecturerId() != null) {
            lecturer = employeeRepository.findById(request.getLecturerId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên với ID: " + request.getLecturerId()));
        }

        CourseSection section = CourseSection.builder()
                .classCode(request.getClassCode())
                .course(course)
                .semester(semester)
                .lecturer(lecturer)
                .roomId(request.getRoomId())
                .buildingId(request.getBuildingId())
                .maxStudents(request.getMaxStudents())
                .minStudents(request.getMinStudents())
                .classType(request.getClassType())
                .status(request.getStatus() != null ? request.getStatus() : "planned")
                .registrationStart(request.getRegistrationStart())
                .registrationEnd(request.getRegistrationEnd())
                .note(request.getNote())
                .build();

        return mapToResponse(courseSectionRepository.save(section));
    }

    @Override
    @Transactional
    public CourseSectionResponse updateSection(UUID id, CourseSectionRequest request) {
        CourseSection section = courseSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần với ID: " + id));

        if (!section.getClassCode().equals(request.getClassCode()) &&
            courseSectionRepository.findByClassCode(request.getClassCode()).isPresent()) {
            throw new RuntimeException("Mã lớp học phần đã tồn tại: " + request.getClassCode());
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học với ID: " + request.getCourseId()));
        
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ với ID: " + request.getSemesterId()));

        Employee lecturer = null;
        if (request.getLecturerId() != null) {
            lecturer = employeeRepository.findById(request.getLecturerId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên với ID: " + request.getLecturerId()));
        }

        section.setClassCode(request.getClassCode());
        section.setCourse(course);
        section.setSemester(semester);
        section.setLecturer(lecturer);
        section.setRoomId(request.getRoomId());
        section.setBuildingId(request.getBuildingId());
        section.setMaxStudents(request.getMaxStudents());
        section.setMinStudents(request.getMinStudents());
        section.setClassType(request.getClassType());
        if (request.getStatus() != null) section.setStatus(request.getStatus());
        section.setRegistrationStart(request.getRegistrationStart());
        section.setRegistrationEnd(request.getRegistrationEnd());
        section.setNote(request.getNote());

        return mapToResponse(courseSectionRepository.save(section));
    }

    @Override
    @Transactional
    public void deleteSection(UUID id) {
        CourseSection section = courseSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần với ID: " + id));
        courseSectionRepository.delete(section);
    }

    private CourseSectionResponse mapToResponse(CourseSection section) {
        return CourseSectionResponse.builder()
                .id(section.getId())
                .classCode(section.getClassCode())
                .courseId(section.getCourse() != null ? section.getCourse().getId() : null)
                .courseCode(section.getCourse() != null ? section.getCourse().getCourseCode() : null)
                .courseName(section.getCourse() != null ? section.getCourse().getCourseName() : null)
                .semesterId(section.getSemester() != null ? section.getSemester().getId() : null)
                .semesterName(section.getSemester() != null ? section.getSemester().getSemesterName() : null)
                .lecturerId(section.getLecturer() != null ? section.getLecturer().getId() : null)
                .lecturerName(section.getLecturer() != null ? section.getLecturer().getFullName() : "Chưa phân công")
                .roomId(section.getRoomId())
                .buildingId(section.getBuildingId())
                .maxStudents(section.getMaxStudents())
                .minStudents(section.getMinStudents())
                .currentStudents(0) // Logic đăng ký sẽ xử lý phần này
                .classType(section.getClassType())
                .status(section.getStatus())
                .registrationStart(section.getRegistrationStart())
                .registrationEnd(section.getRegistrationEnd())
                .note(section.getNote())
                .build();
    }
}
