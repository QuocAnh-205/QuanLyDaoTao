package uni.it.stdmanager.modules.iii_lecturer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iii_lecturer.dto.response.DepartmentResponse;
import uni.it.stdmanager.modules.iii_lecturer.service.DepartmentService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Tag(name = "III. Lecturer Module", description = "API Quản lý Cán bộ Giảng viên")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "1. Lấy danh sách Khoa/Viện", description = "Lấy danh sách các Khoa/Viện/Phòng ban đang hoạt động (cho dropdown)")
    public ApiResponse<List<DepartmentResponse>> getAllActiveDepartments() {
        return ApiResponse.success(departmentService.getAllActiveDepartments(), "Lấy danh sách khoa/viện thành công");
    }
}
