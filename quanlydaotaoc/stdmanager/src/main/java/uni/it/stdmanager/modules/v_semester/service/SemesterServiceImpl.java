package uni.it.stdmanager.modules.v_semester.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.v_semester.dto.request.SemesterRequest;
import uni.it.stdmanager.modules.v_semester.dto.response.SemesterResponse;
import uni.it.stdmanager.modules.v_semester.entity.Semester;
import uni.it.stdmanager.modules.v_semester.repository.SemesterRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;

    @Override
    public List<SemesterResponse> getAllSemesters() {
        return semesterRepository.findAll().stream()
                .sorted((s1, s2) -> {
                    if (s1.getStartDate() == null || s2.getStartDate() == null) return 0;
                    return s2.getStartDate().compareTo(s1.getStartDate()); // Mới nhất lên đầu
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SemesterResponse getSemesterById(UUID id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ với ID: " + id));
        return mapToResponse(semester);
    }

    @Override
    public SemesterResponse getActiveSemester() {
        return semesterRepository.findAll().stream()
                .filter(Semester::getIsActive)
                .findFirst()
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Không có học kỳ nào đang kích hoạt"));
    }

    @Override
    @Transactional
    public SemesterResponse createSemester(SemesterRequest request) {
        if (semesterRepository.findBySemesterCode(request.getSemesterCode()).isPresent()) {
            throw new RuntimeException("Mã học kỳ đã tồn tại: " + request.getSemesterCode());
        }

        Semester semester = Semester.builder()
                .semesterCode(request.getSemesterCode())
                .semesterName(request.getSemesterName())
                .academicYear(request.getAcademicYear())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        semester.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        return mapToResponse(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public SemesterResponse updateSemester(UUID id, SemesterRequest request) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ với ID: " + id));

        if (!semester.getSemesterCode().equals(request.getSemesterCode()) &&
            semesterRepository.findBySemesterCode(request.getSemesterCode()).isPresent()) {
            throw new RuntimeException("Mã học kỳ đã tồn tại: " + request.getSemesterCode());
        }

        semester.setSemesterCode(request.getSemesterCode());
        semester.setSemesterName(request.getSemesterName());
        semester.setAcademicYear(request.getAcademicYear());
        semester.setStartDate(request.getStartDate());
        semester.setEndDate(request.getEndDate());
        if (request.getIsActive() != null) semester.setIsActive(request.getIsActive());

        return mapToResponse(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public void deleteSemester(UUID id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ với ID: " + id));
        semesterRepository.delete(semester);
    }

    private SemesterResponse mapToResponse(Semester semester) {
        return SemesterResponse.builder()
                .id(semester.getId())
                .semesterCode(semester.getSemesterCode())
                .semesterName(semester.getSemesterName())
                .academicYear(semester.getAcademicYear())
                .startDate(semester.getStartDate())
                .endDate(semester.getEndDate())
                .isActive(semester.getIsActive())
                .build();
    }
}
