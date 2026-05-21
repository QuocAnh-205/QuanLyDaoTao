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
import uni.it.stdmanager.modules.vii_tuition.dto.request.TuitionFeeRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.TuitionFeeResponse;
import uni.it.stdmanager.modules.vii_tuition.service.TuitionFeeService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tuition-fees")
@RequiredArgsConstructor
@Tag(name = "Tuition Fee Configurations", description = "Quản lý định mức học phí tín chỉ")
public class TuitionFeeController {

    private final TuitionFeeService tuitionFeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'SINHVIEN')")
    @Operation(summary = "Tìm kiếm & phân trang định mức học phí")
    public ApiResponse<Page<TuitionFeeResponse>> search(
            @RequestParam(required = false) UUID programId,
            @RequestParam(required = false) String courseYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TuitionFeeResponse> response = tuitionFeeService.searchTuitionFees(programId, courseYear, pageable);
        return ApiResponse.success(response, "Lấy danh sách định mức thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'SINHVIEN')")
    @Operation(summary = "Lấy định mức học phí theo ID")
    public ApiResponse<TuitionFeeResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(tuitionFeeService.getTuitionFeeById(id), "Lấy định mức thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Tạo mới định mức học phí")
    public ApiResponse<TuitionFeeResponse> create(@RequestBody TuitionFeeRequest request) {
        return ApiResponse.success(tuitionFeeService.createTuitionFee(request), "Tạo mới định mức thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Cập nhật định mức học phí")
    public ApiResponse<TuitionFeeResponse> update(@PathVariable UUID id, @RequestBody TuitionFeeRequest request) {
        return ApiResponse.success(tuitionFeeService.updateTuitionFee(id, request), "Cập nhật định mức thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Xóa mềm định mức học phí")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        tuitionFeeService.deleteTuitionFee(id);
        return ApiResponse.success(null, "Xóa định mức thành công");
    }
}
