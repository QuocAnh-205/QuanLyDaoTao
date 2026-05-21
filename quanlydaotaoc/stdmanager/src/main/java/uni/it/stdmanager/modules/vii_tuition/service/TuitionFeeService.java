package uni.it.stdmanager.modules.vii_tuition.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uni.it.stdmanager.modules.vii_tuition.dto.request.TuitionFeeRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.TuitionFeeResponse;

import java.util.UUID;

public interface TuitionFeeService {
    Page<TuitionFeeResponse> searchTuitionFees(UUID programId, String courseYear, Pageable pageable);
    TuitionFeeResponse getTuitionFeeById(UUID id);
    TuitionFeeResponse createTuitionFee(TuitionFeeRequest request);
    TuitionFeeResponse updateTuitionFee(UUID id, TuitionFeeRequest request);
    void deleteTuitionFee(UUID id);
}
