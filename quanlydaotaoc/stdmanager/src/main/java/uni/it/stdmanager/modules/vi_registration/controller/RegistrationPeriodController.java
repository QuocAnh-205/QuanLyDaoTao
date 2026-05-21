package uni.it.stdmanager.modules.vi_registration.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.vi_registration.dto.request.RegistrationPeriodRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.RegistrationPeriodResponse;
import uni.it.stdmanager.modules.vi_registration.service.RegistrationPeriodService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/registration-periods")
@RequiredArgsConstructor
@Tag(name = "Registration Period", description = "Quản lý các đợt đăng ký môn học")
public class RegistrationPeriodController {

    private final RegistrationPeriodService registrationPeriodService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'SINHVIEN')")
    @Operation(summary = "Lấy danh sách tất cả các đợt đăng ký")
    public ApiResponse<List<RegistrationPeriodResponse>> getAll() {
        return ApiResponse.success(registrationPeriodService.getAll(), "Lấy danh sách đợt đăng ký thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'SINHVIEN')")
    @Operation(summary = "Lấy thông tin chi tiết một đợt đăng ký")
    public ApiResponse<RegistrationPeriodResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(registrationPeriodService.getById(id), "Lấy thông tin đợt đăng ký thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Tạo mới một đợt đăng ký")
    public ApiResponse<RegistrationPeriodResponse> create(@RequestBody @Valid RegistrationPeriodRequest request) {
        return ApiResponse.success(registrationPeriodService.create(request), "Tạo mới đợt đăng ký thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Cập nhật thông tin đợt đăng ký")
    public ApiResponse<RegistrationPeriodResponse> update(@PathVariable UUID id, @RequestBody @Valid RegistrationPeriodRequest request) {
        return ApiResponse.success(registrationPeriodService.update(id, request), "Cập nhật đợt đăng ký thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Xóa (ẩn) một đợt đăng ký")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        registrationPeriodService.delete(id);
        return ApiResponse.success(null, "Xóa đợt đăng ký thành công");
    }
}
