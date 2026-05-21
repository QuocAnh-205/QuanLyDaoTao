package uni.it.stdmanager.modules.vi_registration.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.vi_registration.dto.request.CourseRegistrationRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.CourseRegistrationResponse;
import uni.it.stdmanager.modules.vi_registration.service.CourseRegistrationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/course-registrations")
@RequiredArgsConstructor
@Tag(name = "Course Registration", description = "Quản lý đăng ký môn học của sinh viên")
public class CourseRegistrationController {

    private final CourseRegistrationService courseRegistrationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SINHVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Đăng ký môn học mới")
    public ApiResponse<CourseRegistrationResponse> register(@RequestBody @Valid CourseRegistrationRequest request) {
        return ApiResponse.success(courseRegistrationService.register(request), "Đăng ký môn học thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SINHVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Hủy đăng ký môn học")
    public ApiResponse<Void> cancel(@PathVariable UUID id) {
        courseRegistrationService.cancel(id);
        return ApiResponse.success(null, "Hủy đăng ký môn học thành công");
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SINHVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách đăng ký của một sinh viên")
    public ApiResponse<List<CourseRegistrationResponse>> getByStudent(@PathVariable UUID studentId) {
        return ApiResponse.success(courseRegistrationService.getByStudent(studentId), "Lấy danh sách đăng ký của sinh viên thành công");
    }

    @GetMapping("/section/{sectionId}")
    @PreAuthorize("hasAnyRole('GIANGVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách đăng ký của một lớp học phần")
    public ApiResponse<List<CourseRegistrationResponse>> getBySection(@PathVariable UUID sectionId) {
        return ApiResponse.success(courseRegistrationService.getBySection(sectionId), "Lấy danh sách đăng ký của lớp học phần thành công");
    }
}
