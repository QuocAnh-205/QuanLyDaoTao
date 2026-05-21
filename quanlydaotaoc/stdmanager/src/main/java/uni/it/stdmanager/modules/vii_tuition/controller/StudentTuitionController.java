package uni.it.stdmanager.modules.vii_tuition.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.vii_tuition.dto.request.ManualTuitionRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.request.StudentTuitionAdjustRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.request.StudentTuitionSearchRequest;
import uni.it.stdmanager.modules.vii_tuition.dto.response.StudentTuitionResponse;
import uni.it.stdmanager.modules.vii_tuition.service.StudentTuitionService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student-tuitions")
@RequiredArgsConstructor
@Tag(name = "Student Tuition Management", description = "Quản lý công nợ học phí sinh viên")
public class StudentTuitionController {

    private final StudentTuitionService studentTuitionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'SINHVIEN')")
    @Operation(summary = "Tìm kiếm & lọc danh sách học phí sinh viên")
    public ApiResponse<Page<StudentTuitionResponse>> search(StudentTuitionSearchRequest request) {
        Page<StudentTuitionResponse> response = studentTuitionService.searchStudentTuitions(request);
        return ApiResponse.success(response, "Lấy danh sách học phí thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'SINHVIEN')")
    @Operation(summary = "Lấy thông tin chi tiết học phí")
    public ApiResponse<StudentTuitionResponse> getById(@PathVariable UUID id) {
        return ApiResponse.success(studentTuitionService.getStudentTuitionById(id), "Lấy thông tin học phí thành công");
    }

    @PostMapping("/calculate")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Tính học phí tự động cho một sinh viên trong học kỳ")
    public ApiResponse<StudentTuitionResponse> calculate(
            @RequestParam UUID studentId,
            @RequestParam UUID semesterId) {
        StudentTuitionResponse response = studentTuitionService.calculateTuition(studentId, semesterId);
        return ApiResponse.success(response, "Tính học phí sinh viên thành công");
    }

    @PostMapping("/calculate-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Quét & tính học phí hàng loạt cho tất cả sinh viên đăng ký trong học kỳ")
    public ApiResponse<Void> calculateAll(@RequestParam UUID semesterId) {
        studentTuitionService.calculateTuitionForAll(semesterId);
        return ApiResponse.success(null, "Tính học phí hàng loạt thành công");
    }

    @PutMapping("/{id}/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Điều chỉnh miễn giảm & học bổng")
    public ApiResponse<StudentTuitionResponse> adjust(
            @PathVariable UUID id,
            @RequestBody StudentTuitionAdjustRequest request) {
        StudentTuitionResponse response = studentTuitionService.adjustTuition(id, request);
        return ApiResponse.success(response, "Điều chỉnh miễn giảm học phí thành công");
    }

    @PostMapping("/manual")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Thêm thủ công hồ sơ nợ học phí cho sinh viên (không cần đăng ký học phần)")
    public ApiResponse<StudentTuitionResponse> createManual(@RequestBody ManualTuitionRequest request) {
        StudentTuitionResponse response = studentTuitionService.createManualTuition(request);
        return ApiResponse.success(response, "Tạo hồ sơ học phí thủ công thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Xóa hồ sơ học phí sinh viên")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        studentTuitionService.deleteTuition(id);
        return ApiResponse.success(null, "Xóa hồ sơ học phí thành công");
    }
}
