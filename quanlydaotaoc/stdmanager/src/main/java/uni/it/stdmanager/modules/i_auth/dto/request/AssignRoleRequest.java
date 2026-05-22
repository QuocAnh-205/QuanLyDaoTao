package uni.it.stdmanager.modules.i_auth.dto.request;

import lombok.*;

import java.util.List;

/**
 * DTO request để Admin gán vai trò cho người dùng.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignRoleRequest {

    /**
     * Danh sách mã vai trò mới (sẽ thay thế toàn bộ các vai trò hiện tại).
     * Ví dụ: ["ADMIN", "GIAOVU"]
     */
    private List<String> roleCodes;
}
