package uni.it.stdmanager.modules.vi_registration.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.vi_registration.dto.request.EquivalentCourseRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.EquivalentCourseResponse;
import uni.it.stdmanager.modules.vi_registration.service.EquivalentCourseService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/equivalent-courses")
@RequiredArgsConstructor
@Tag(name = "Equivalent Course", description = "Quản lý môn học tương đương/thay thế")
public class EquivalentCourseController {

    private final EquivalentCourseService equivalentCourseService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Lấy danh sách tất cả môn học tương đương")
    public ApiResponse<List<EquivalentCourseResponse>> getAll() {
        return ApiResponse.success(equivalentCourseService.getAll(), "Lấy danh sách môn học tương đương thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Tạo mới một quan hệ tương đương")
    public ApiResponse<EquivalentCourseResponse> create(@RequestBody @Valid EquivalentCourseRequest request) {
        return ApiResponse.success(equivalentCourseService.create(request), "Tạo mới môn học tương đương thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "Xóa quan hệ tương đương")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        equivalentCourseService.delete(id);
        return ApiResponse.success(null, "Xóa môn học tương đương thành công");
    }
}
