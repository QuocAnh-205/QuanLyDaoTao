package uni.it.stdmanager.modules.vii_tuition.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.vii_tuition.dto.request.PaymentRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.PaymentResponse;
import uni.it.stdmanager.modules.vii_tuition.entity.Payment;
import uni.it.stdmanager.modules.vii_tuition.entity.StudentTuition;
import uni.it.stdmanager.modules.vii_tuition.repository.PaymentRepository;
import uni.it.stdmanager.modules.vii_tuition.repository.StudentTuitionRepository;
import uni.it.stdmanager.modules.vii_tuition.service.PaymentService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentTuitionRepository studentTuitionRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final UserRepository userRepository;

    @Override
    public PaymentResponse createPayment(PaymentRequest request) {
        StudentTuition tuition = studentTuitionRepository.findById(request.getTuitionId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin học phí sinh viên"));

        BigDecimal amountPaid = request.getAmountPaid() != null ? request.getAmountPaid() : BigDecimal.ZERO;
        if (amountPaid.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Số tiền đóng phải lớn hơn 0");
        }

        // 1. Cập nhật paidAmount và debtAmount của StudentTuition
        BigDecimal currentPaid = tuition.getPaidAmount() != null ? tuition.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal newPaid = currentPaid.add(amountPaid);

        BigDecimal netAmount = tuition.getNetAmount() != null ? tuition.getNetAmount() : BigDecimal.ZERO;
        BigDecimal newDebt = netAmount.subtract(newPaid);

        int status = 3; // DEBT
        if (newDebt.compareTo(BigDecimal.ZERO) <= 0) {
            newDebt = BigDecimal.ZERO;
            status = 1; // PAID
        } else if (newPaid.compareTo(BigDecimal.ZERO) > 0) {
            status = 2; // PARTIAL
        }

        tuition.setPaidAmount(newPaid);
        tuition.setDebtAmount(newDebt);
        tuition.setStatus(status);
        studentTuitionRepository.save(tuition);

        // 2. Ghi nhận giao dịch Payment
        UUID cashierId = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                String username = auth.getName();
                User user = userRepository.findByUsername(username).orElse(null);
                if (user != null) {
                    cashierId = user.getId();
                }
            }
        } catch (Exception e) {
            // Safe fallback
        }

        Payment payment = Payment.builder()
                .tuition(tuition)
                .amountPaid(amountPaid)
                .paymentDate(LocalDateTime.now())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("SUCCESS")
                .transactionRef(request.getTransactionRef())
                .cashierId(cashierId)
                .notes(request.getNotes())
                .build();
        payment.setIsActive(true);
        payment = paymentRepository.save(payment);

        // 3. Tự động cập nhật isPaid và status = 1 (Thành công) cho các CourseRegistration trong kỳ
        List<CourseRegistration> registrations = courseRegistrationRepository
                .findAllByStudentIdAndCourseSectionSemesterId(tuition.getStudent().getId(), tuition.getSemester().getId());

        for (CourseRegistration reg : registrations) {
            if (Boolean.TRUE.equals(reg.getIsActive())) {
                reg.setIsPaid(true);
                if (reg.getStatus() == 2) { // 2: Chờ thanh toán
                    reg.setStatus(1); // 1: Thành công
                }
                courseRegistrationRepository.save(reg);
            }
        }

        return mapToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getPaymentsByTuitionId(UUID tuitionId) {
        List<Payment> payments = paymentRepository.findAllByTuitionIdAndIsActiveTrueOrderByPaymentDateDesc(tuitionId);
        return payments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public Page<PaymentResponse> searchPayments(UUID studentId, UUID semesterId, Pageable pageable) {
        Page<Payment> payments = paymentRepository.searchPayments(studentId, semesterId, pageable);
        return payments.map(this::mapToResponse);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .tuitionId(payment.getTuition().getId())
                .studentCode(payment.getTuition().getStudent().getStudentCode())
                .studentName(payment.getTuition().getStudent().getFullName())
                .semesterName(payment.getTuition().getSemester().getSemesterName())
                .amountPaid(payment.getAmountPaid())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .transactionRef(payment.getTransactionRef())
                .cashierId(payment.getCashierId())
                .notes(payment.getNotes())
                .build();
    }
}
