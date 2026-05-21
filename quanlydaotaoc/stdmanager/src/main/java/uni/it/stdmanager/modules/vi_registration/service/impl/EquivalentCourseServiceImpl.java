package uni.it.stdmanager.modules.vi_registration.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iv_course.entity.Course;
import uni.it.stdmanager.modules.iv_course.repository.CourseRepository;
import uni.it.stdmanager.modules.vi_registration.dto.request.EquivalentCourseRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.EquivalentCourseResponse;
import uni.it.stdmanager.modules.vi_registration.entity.EquivalentCourse;
import uni.it.stdmanager.modules.vi_registration.repository.EquivalentCourseRepository;
import uni.it.stdmanager.modules.vi_registration.service.EquivalentCourseService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquivalentCourseServiceImpl implements EquivalentCourseService {

    private final EquivalentCourseRepository equivalentCourseRepository;
    private final CourseRepository courseRepository;

    @Override
    public List<EquivalentCourseResponse> getAll() {
        return equivalentCourseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EquivalentCourseResponse create(EquivalentCourseRequest request) {
        Course original = courseRepository.findById(request.getOriginalCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học gốc"));
        Course equivalent = courseRepository.findById(request.getEquivalentCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học tương đương"));

        EquivalentCourse ec = EquivalentCourse.builder()
                .originalCourse(original)
                .equivalentCourse(equivalent)
                .equivalenceType(request.getEquivalenceType())
                .effectDate(request.getEffectDate())
                .note(request.getNote())
                .build();

        return mapToResponse(equivalentCourseRepository.save(ec));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        EquivalentCourse ec = equivalentCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu tương đương"));
        equivalentCourseRepository.delete(ec);
    }

    private EquivalentCourseResponse mapToResponse(EquivalentCourse ec) {
        return EquivalentCourseResponse.builder()
                .id(ec.getId())
                .originalCourseId(ec.getOriginalCourse().getId())
                .originalCourseName(ec.getOriginalCourse().getCourseName())
                .equivalentCourseId(ec.getEquivalentCourse().getId())
                .equivalentCourseName(ec.getEquivalentCourse().getCourseName())
                .equivalenceType(ec.getEquivalenceType())
                .effectDate(ec.getEffectDate())
                .note(ec.getNote())
                .isActive(ec.getIsActive())
                .build();
    }
}
