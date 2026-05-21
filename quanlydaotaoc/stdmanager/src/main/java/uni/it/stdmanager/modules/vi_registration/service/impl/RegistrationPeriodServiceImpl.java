package uni.it.stdmanager.modules.vi_registration.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.v_semester.entity.Semester;
import uni.it.stdmanager.modules.v_semester.repository.SemesterRepository;
import uni.it.stdmanager.modules.vi_registration.dto.request.RegistrationPeriodRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.RegistrationPeriodResponse;
import uni.it.stdmanager.modules.vi_registration.entity.RegistrationPeriod;
import uni.it.stdmanager.modules.vi_registration.repository.RegistrationPeriodRepository;
import uni.it.stdmanager.modules.vi_registration.service.RegistrationPeriodService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegistrationPeriodServiceImpl implements RegistrationPeriodService {

    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final SemesterRepository semesterRepository;

    @Override
    public List<RegistrationPeriodResponse> getAll() {
        return registrationPeriodRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RegistrationPeriodResponse getById(UUID id) {
        RegistrationPeriod period = registrationPeriodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt đăng ký: " + id));
        return mapToResponse(period);
    }

    @Override
    @Transactional
    public RegistrationPeriodResponse create(RegistrationPeriodRequest request) {
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ: " + request.getSemesterId()));

        RegistrationPeriod period = RegistrationPeriod.builder()
                .name(request.getName())
                .semester(semester)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .targetConfig(request.getTargetConfig())
                .maxCredits(request.getMaxCredits() != null ? request.getMaxCredits() : 25)
                .minCredits(request.getMinCredits() != null ? request.getMinCredits() : 12)
                .allowRetake(request.getAllowRetake() != null ? request.getAllowRetake() : true)
                .build();

        return mapToResponse(registrationPeriodRepository.save(period));
    }

    @Override
    @Transactional
    public RegistrationPeriodResponse update(UUID id, RegistrationPeriodRequest request) {
        RegistrationPeriod period = registrationPeriodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt đăng ký: " + id));

        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ: " + request.getSemesterId()));

        period.setName(request.getName());
        period.setSemester(semester);
        period.setStartTime(request.getStartTime());
        period.setEndTime(request.getEndTime());
        period.setTargetConfig(request.getTargetConfig());
        if (request.getMaxCredits() != null) period.setMaxCredits(request.getMaxCredits());
        if (request.getMinCredits() != null) period.setMinCredits(request.getMinCredits());
        if (request.getAllowRetake() != null) period.setAllowRetake(request.getAllowRetake());

        return mapToResponse(registrationPeriodRepository.save(period));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        RegistrationPeriod period = registrationPeriodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt đăng ký: " + id));
        period.setIsActive(false); // Soft delete based on project standard
        registrationPeriodRepository.save(period);
    }

    private RegistrationPeriodResponse mapToResponse(RegistrationPeriod period) {
        return RegistrationPeriodResponse.builder()
                .id(period.getId())
                .name(period.getName())
                .semesterId(period.getSemester().getId())
                .semesterName(period.getSemester().getSemesterName())
                .startTime(period.getStartTime())
                .endTime(period.getEndTime())
                .targetConfig(period.getTargetConfig())
                .maxCredits(period.getMaxCredits())
                .minCredits(period.getMinCredits())
                .allowRetake(period.getAllowRetake())
                .isActive(period.getIsActive())
                .build();
    }
}
