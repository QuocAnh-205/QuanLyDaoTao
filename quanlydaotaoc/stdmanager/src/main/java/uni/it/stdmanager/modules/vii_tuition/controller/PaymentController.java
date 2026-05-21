package uni.it.stdmanager.modules.vii_tuition.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.vii_tuition.dto.request.PaymentRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.PaymentResponse;
import uni.it.stdmanager.modules.vii_tuition.service.PaymentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management", description = "Quản lý đóng tiền & lịch sử giao dịch")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Ghi nhận giao dịch thanh toán học phí")
    public ApiResponse<PaymentResponse> create(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return ApiResponse.success(response, "Thực hiện thanh toán thành công");
    }

    @GetMapping("/tuition/{tuitionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'SINHVIEN')")
    @Operation(summary = "Lấy lịch sử thanh toán của một khoản học phí")
    public ApiResponse<List<PaymentResponse>> getByTuitionId(@PathVariable UUID tuitionId) {
        return ApiResponse.success(paymentService.getPaymentsByTuitionId(tuitionId), "Lấy lịch sử thanh toán thành công");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Tìm kiếm & phân trang lịch sử giao dịch hệ thống")
    public ApiResponse<Page<PaymentResponse>> search(
            @RequestParam(required = false) UUID studentId,
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "paymentDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PaymentResponse> response = paymentService.searchPayments(studentId, semesterId, pageable);
        return ApiResponse.success(response, "Lấy danh sách giao dịch thành công");
    }
}
