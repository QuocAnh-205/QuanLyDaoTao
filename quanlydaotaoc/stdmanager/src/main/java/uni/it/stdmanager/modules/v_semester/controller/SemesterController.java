package uni.it.stdmanager.modules.v_semester.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.v_semester.dto.request.SemesterRequest;
import uni.it.stdmanager.modules.v_semester.dto.response.SemesterResponse;
import uni.it.stdmanager.modules.v_semester.service.SemesterService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/semesters")
@RequiredArgsConstructor
@Tag(name = "V. Academic Module", description = "API Quản lý Học kỳ và Lớp học phần")
public class SemesterController {

    private final SemesterService semesterService;

    @GetMapping
    @Operation(summary = "1. Danh sách học kỳ", description = "Lấy toàn bộ danh sách các học kỳ")
    public ApiResponse<List<SemesterResponse>> getAllSemesters() {
        return ApiResponse.success(semesterService.getAllSemesters(), "Lấy danh sách học kỳ thành công");
    }

    @GetMapping("/active")
    @Operation(summary = "2. Học kỳ hiện tại", description = "Lấy thông tin học kỳ đang kích hoạt")
    public ApiResponse<SemesterResponse> getActiveSemester() {
        return ApiResponse.success(semesterService.getActiveSemester(), "Lấy học kỳ hiện tại thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "3. Chi tiết học kỳ", description = "Lấy thông tin chi tiết học kỳ theo ID")
    public ApiResponse<SemesterResponse> getSemesterById(@PathVariable UUID id) {
        return ApiResponse.success(semesterService.getSemesterById(id), "Lấy thông tin học kỳ thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "4. Tạo mới học kỳ", description = "Chỉ dành cho Giáo vụ hoặc Admin")
    public ApiResponse<SemesterResponse> createSemester(@Valid @RequestBody SemesterRequest request) {
        return ApiResponse.success(semesterService.createSemester(request), "Tạo học kỳ thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "5. Cập nhật học kỳ", description = "Cập nhật thông tin học kỳ (Giáo vụ/Admin)")
    public ApiResponse<SemesterResponse> updateSemester(@PathVariable UUID id, @Valid @RequestBody SemesterRequest request) {
        return ApiResponse.success(semesterService.updateSemester(id, request), "Cập nhật học kỳ thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "6. Xóa học kỳ", description = "Xóa học kỳ (Giáo vụ/Admin)")
    public ApiResponse<Void> deleteSemester(@PathVariable UUID id) {
        semesterService.deleteSemester(id);
        return ApiResponse.success(null, "Xóa học kỳ thành công");
    }
}
