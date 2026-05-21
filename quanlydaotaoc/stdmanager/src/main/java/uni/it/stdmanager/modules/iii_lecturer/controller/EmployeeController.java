package uni.it.stdmanager.modules.iii_lecturer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iii_lecturer.dto.request.EmployeeRequest;
import uni.it.stdmanager.modules.iii_lecturer.dto.response.EmployeeResponse;
import uni.it.stdmanager.modules.iii_lecturer.service.EmployeeService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Tag(name = "III. Lecturer Module", description = "API Quản lý Cán bộ Giảng viên")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "3. Tìm kiếm giảng viên/nhân viên", description = "Tìm kiếm có phân trang và lọc theo phòng ban/chức danh")
    public ApiResponse<Page<EmployeeResponse>> searchEmployees(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) UUID positionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<EmployeeResponse> response = employeeService.searchEmployees(keyword, departmentId, positionId, pageable);
        return ApiResponse.success(response, "Lấy danh sách giảng viên/nhân viên thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "4. Xem chi tiết giảng viên/nhân viên", description = "Lấy thông tin chi tiết bằng UUID")
    public ApiResponse<EmployeeResponse> getEmployeeById(@PathVariable UUID id) {
        return ApiResponse.success(employeeService.getEmployeeById(id), "Lấy thông tin chi tiết thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "5. Thêm mới giảng viên/nhân viên", description = "Tạo mới và cấp tài khoản đăng nhập")
    public ApiResponse<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        return ApiResponse.success(employeeService.createEmployee(request), "Thêm mới giảng viên/nhân viên thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "6. Cập nhật thông tin giảng viên/nhân viên", description = "Cập nhật thông tin cá nhân và học vụ")
    public ApiResponse<EmployeeResponse> updateEmployee(
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeRequest request) {
        return ApiResponse.success(employeeService.updateEmployee(id, request), "Cập nhật thông tin thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @Operation(summary = "7. Xóa giảng viên/nhân viên", description = "Vô hiệu hóa tài khoản và hồ sơ (Soft delete)")
    public ApiResponse<Void> deleteEmployee(@PathVariable UUID id) {
        employeeService.deleteEmployee(id);
        return ApiResponse.success(null, "Xóa giảng viên/nhân viên thành công");
    }
}
