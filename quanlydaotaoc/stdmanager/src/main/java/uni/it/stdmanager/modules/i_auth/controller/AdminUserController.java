package uni.it.stdmanager.modules.i_auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.i_auth.dto.request.AdminUserRequest;
import uni.it.stdmanager.modules.i_auth.dto.request.AssignRoleRequest;
import uni.it.stdmanager.modules.i_auth.dto.response.AdminUserResponse;
import uni.it.stdmanager.modules.i_auth.entity.Role;
import uni.it.stdmanager.modules.i_auth.service.AdminUserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "I. Auth Module — Admin", description = "API Quản trị Người dùng (chỉ dành cho Admin)")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/users")
    @Operation(
        summary = "1. Danh sách người dùng",
        description = "Lấy danh sách tất cả tài khoản trong hệ thống, hỗ trợ tìm kiếm và phân trang"
    )
    public ApiResponse<Page<AdminUserResponse>> getAllUsers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AdminUserResponse> data = adminUserService.getAllUsers(keyword, page, size);
        return ApiResponse.success(data, "Lấy danh sách người dùng thành công");
    }

    @GetMapping("/users/{id}")
    @Operation(
        summary = "2. Chi tiết người dùng",
        description = "Xem đầy đủ thông tin một tài khoản theo ID"
    )
    public ApiResponse<AdminUserResponse> getUserById(@PathVariable UUID id) {
        AdminUserResponse data = adminUserService.getUserById(id);
        return ApiResponse.success(data, "Lấy thông tin người dùng thành công");
    }

    @PostMapping("/users")
    @Operation(
        summary = "3. Tạo tài khoản mới",
        description = "Admin tạo tài khoản người dùng mới với vai trò mặc định SINHVIEN"
    )
    public ApiResponse<AdminUserResponse> createUser(@Valid @RequestBody AdminUserRequest request) {
        AdminUserResponse data = adminUserService.createUser(request);
        return ApiResponse.success(data, "Tạo tài khoản thành công");
    }

    @PutMapping("/users/{id}")
    @Operation(
        summary = "4. Cập nhật tài khoản",
        description = "Admin chỉnh sửa thông tin tài khoản người dùng"
    )
    public ApiResponse<AdminUserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody AdminUserRequest request) {
        AdminUserResponse data = adminUserService.updateUser(id, request);
        return ApiResponse.success(data, "Cập nhật tài khoản thành công");
    }

    @PutMapping("/users/{id}/toggle-status")
    @Operation(
        summary = "5. Khoá / Mở khoá tài khoản",
        description = "Chuyển đổi trạng thái kích hoạt của tài khoản (isActive)"
    )
    public ApiResponse<AdminUserResponse> toggleUserStatus(@PathVariable UUID id) {
        AdminUserResponse data = adminUserService.toggleUserStatus(id);
        return ApiResponse.success(data, "Cập nhật trạng thái tài khoản thành công");
    }

    @PutMapping("/users/{id}/roles")
    @Operation(
        summary = "6. Phân quyền vai trò",
        description = "Gán danh sách vai trò mới cho người dùng (thay thế toàn bộ vai trò cũ)"
    )
    public ApiResponse<AdminUserResponse> assignRoles(
            @PathVariable UUID id,
            @RequestBody AssignRoleRequest request) {
        AdminUserResponse data = adminUserService.assignRoles(id, request);
        return ApiResponse.success(data, "Phân quyền vai trò thành công");
    }

    @GetMapping("/roles")
    @Operation(
        summary = "7. Danh sách vai trò",
        description = "Lấy tất cả vai trò trong hệ thống để hiển thị cho form phân quyền"
    )
    public ApiResponse<List<Role>> getAllRoles() {
        List<Role> roles = adminUserService.getAllRoles();
        return ApiResponse.success(roles, "Lấy danh sách vai trò thành công");
    }
}
