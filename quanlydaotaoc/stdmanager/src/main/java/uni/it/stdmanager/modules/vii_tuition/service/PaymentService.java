package uni.it.stdmanager.modules.vii_tuition.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uni.it.stdmanager.modules.vii_tuition.dto.request.PaymentRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.PaymentResponse;

import java.util.List;
import java.util.UUID;

public interface PaymentService {
    PaymentResponse createPayment(PaymentRequest request);
    List<PaymentResponse> getPaymentsByTuitionId(UUID tuitionId);
    Page<PaymentResponse> searchPayments(UUID studentId, UUID semesterId, Pageable pageable);
}
