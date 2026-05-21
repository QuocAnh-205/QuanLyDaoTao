package uni.it.stdmanager.modules.vii_tuition.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgram;
import uni.it.stdmanager.modules.iv_course.repository.TrainingProgramRepository;
import uni.it.stdmanager.modules.vii_tuition.dto.request.TuitionFeeRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.TuitionFeeResponse;
import uni.it.stdmanager.modules.vii_tuition.entity.TuitionFee;
import uni.it.stdmanager.modules.vii_tuition.repository.TuitionFeeRepository;
import uni.it.stdmanager.modules.vii_tuition.service.TuitionFeeService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TuitionFeeServiceImpl implements TuitionFeeService {

    private final TuitionFeeRepository tuitionFeeRepository;
    private final TrainingProgramRepository trainingProgramRepository;

    @Override
    public Page<TuitionFeeResponse> searchTuitionFees(UUID programId, String courseYear, Pageable pageable) {
        Page<TuitionFee> fees = tuitionFeeRepository.searchTuitionFees(programId, courseYear, pageable);
        return fees.map(this::mapToResponse);
    }

    @Override
    public TuitionFeeResponse getTuitionFeeById(UUID id) {
        TuitionFee fee = tuitionFeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy định mức học phí"));
        return mapToResponse(fee);
    }

    @Override
    public TuitionFeeResponse createTuitionFee(TuitionFeeRequest request) {
        TrainingProgram program = null;
        if (request.getProgramId() != null) {
            program = trainingProgramRepository.findById(request.getProgramId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình đào tạo"));
        }

        TuitionFee fee = TuitionFee.builder()
                .program(program)
                .courseYear(request.getCourseYear())
                .pricePerCredit(request.getPricePerCredit())
                .baseTuition(request.getBaseTuition())
                .effectiveDate(request.getEffectiveDate())
                .build();
        fee.setIsActive(true);

        fee = tuitionFeeRepository.save(fee);
        return mapToResponse(fee);
    }

    @Override
    public TuitionFeeResponse updateTuitionFee(UUID id, TuitionFeeRequest request) {
        TuitionFee fee = tuitionFeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy định mức học phí"));

        TrainingProgram program = null;
        if (request.getProgramId() != null) {
            program = trainingProgramRepository.findById(request.getProgramId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình đào tạo"));
        }

        fee.setProgram(program);
        fee.setCourseYear(request.getCourseYear());
        fee.setPricePerCredit(request.getPricePerCredit());
        fee.setBaseTuition(request.getBaseTuition());
        fee.setEffectiveDate(request.getEffectiveDate());

        fee = tuitionFeeRepository.save(fee);
        return mapToResponse(fee);
    }

    @Override
    public void deleteTuitionFee(UUID id) {
        TuitionFee fee = tuitionFeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy định mức học phí"));
        fee.setIsActive(false);
        tuitionFeeRepository.save(fee);
    }

    private TuitionFeeResponse mapToResponse(TuitionFee fee) {
        return TuitionFeeResponse.builder()
                .id(fee.getId())
                .programId(fee.getProgram() != null ? fee.getProgram().getId() : null)
                .programName(fee.getProgram() != null ? fee.getProgram().getProgramName() : "Mặc định hệ thống")
                .programCode(fee.getProgram() != null ? fee.getProgram().getProgramCode() : "DEFAULT")
                .courseYear(fee.getCourseYear())
                .pricePerCredit(fee.getPricePerCredit())
                .baseTuition(fee.getBaseTuition())
                .effectiveDate(fee.getEffectiveDate())
                .isActive(fee.getIsActive())
                .build();
    }
}
