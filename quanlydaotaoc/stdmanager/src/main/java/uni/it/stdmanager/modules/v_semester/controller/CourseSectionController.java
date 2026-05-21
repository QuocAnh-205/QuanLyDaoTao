package uni.it.stdmanager.modules.v_semester.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.v_semester.dto.request.CourseSectionRequest;
import uni.it.stdmanager.modules.v_semester.dto.response.CourseSectionResponse;
import uni.it.stdmanager.modules.v_semester.service.CourseSectionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/course-sections")
@RequiredArgsConstructor
@Tag(name = "V. Academic Module")
public class CourseSectionController {

    private final CourseSectionService courseSectionService;

    @GetMapping("/semester/{semesterId}")
    @Operation(summary = "4. Danh sách lớp học phần theo học kỳ")
    public ApiResponse<List<CourseSectionResponse>> getSectionsBySemester(@PathVariable UUID semesterId) {
        return ApiResponse.success(courseSectionService.getSectionsBySemester(semesterId), "Lấy danh sách lớp học phần thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "5. Chi tiết lớp học phần")
    public ApiResponse<CourseSectionResponse> getSectionById(@PathVariable UUID id) {
        return ApiResponse.success(courseSectionService.getSectionById(id), "Lấy chi tiết lớp học phần thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "6. Tạo mới lớp học phần", description = "Giáo vụ/Admin")
    public ApiResponse<CourseSectionResponse> createSection(@Valid @RequestBody CourseSectionRequest request) {
        return ApiResponse.success(courseSectionService.createSection(request), "Tạo lớp học phần thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "7. Cập nhật lớp học phần", description = "Giáo vụ/Admin")
    public ApiResponse<CourseSectionResponse> updateSection(@PathVariable UUID id, @Valid @RequestBody CourseSectionRequest request) {
        return ApiResponse.success(courseSectionService.updateSection(id, request), "Cập nhật lớp học phần thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "8. Xóa lớp học phần", description = "Giáo vụ/Admin")
    public ApiResponse<Void> deleteSection(@PathVariable UUID id) {
        courseSectionService.deleteSection(id);
        return ApiResponse.success(null, "Xóa lớp học phần thành công");
    }
}
