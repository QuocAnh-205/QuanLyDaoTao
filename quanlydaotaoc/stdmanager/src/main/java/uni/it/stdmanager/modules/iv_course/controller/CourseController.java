package uni.it.stdmanager.modules.iv_course.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iv_course.dto.request.CourseRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.CourseResponse;
import uni.it.stdmanager.modules.iv_course.service.CourseService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Tag(name = "IV. Course Module", description = "API Quản lý Môn học và Chương trình đào tạo")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "1. Lấy danh sách môn học", description = "Lấy toàn bộ danh sách môn học trong hệ thống")
    public ApiResponse<List<CourseResponse>> getAllCourses() {
        return ApiResponse.success(courseService.getAllCourses(), "Lấy danh sách môn học thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "2. Lấy chi tiết môn học", description = "Lấy thông tin chi tiết của một môn học theo ID")
    public ApiResponse<CourseResponse> getCourseById(@PathVariable UUID id) {
        return ApiResponse.success(courseService.getCourseById(id), "Lấy thông tin môn học thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "3. Tạo mới môn học", description = "Chỉ dành cho Giáo vụ hoặc Admin")
    public ApiResponse<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        return ApiResponse.success(courseService.createCourse(request), "Tạo môn học thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "4. Cập nhật môn học", description = "Cập nhật thông tin môn học theo ID (Giáo vụ/Admin)")
    public ApiResponse<CourseResponse> updateCourse(@PathVariable UUID id, @Valid @RequestBody CourseRequest request) {
        return ApiResponse.success(courseService.updateCourse(id, request), "Cập nhật môn học thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "5. Xóa môn học", description = "Xóa môn học khỏi hệ thống (Giáo vụ/Admin)")
    public ApiResponse<Void> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ApiResponse.success(null, "Xóa môn học thành công");
    }
}
