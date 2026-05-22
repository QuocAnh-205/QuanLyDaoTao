package uni.it.stdmanager.modules.i_auth.service;

import org.springframework.data.domain.Page;
import uni.it.stdmanager.modules.i_auth.dto.request.AdminUserRequest;
import uni.it.stdmanager.modules.i_auth.dto.request.AssignRoleRequest;
import uni.it.stdmanager.modules.i_auth.dto.response.AdminUserResponse;
import uni.it.stdmanager.modules.i_auth.entity.Role;

import java.util.List;
import java.util.UUID;

/**
 * Service quản lý người dùng dành cho Admin.
 */
public interface AdminUserService {

    /**
     * Lấy danh sách tất cả người dùng, có tìm kiếm và phân trang.
     */
    Page<AdminUserResponse> getAllUsers(String keyword, int page, int size);

    /**
     * Xem chi tiết thông tin một người dùng.
     */
    AdminUserResponse getUserById(UUID id);

    /**
     * Admin tạo tài khoản người dùng mới.
     */
    AdminUserResponse createUser(AdminUserRequest request);

    /**
     * Admin cập nhật thông tin người dùng.
     */
    AdminUserResponse updateUser(UUID id, AdminUserRequest request);

    /**
     * Khoá hoặc mở khoá tài khoản người dùng (toggle isActive).
     */
    AdminUserResponse toggleUserStatus(UUID id);

    /**
     * Gán vai trò mới cho người dùng (thay thế toàn bộ vai trò cũ).
     */
    AdminUserResponse assignRoles(UUID id, AssignRoleRequest request);

    /**
     * Lấy tất cả vai trò trong hệ thống.
     */
    List<Role> getAllRoles();
}
