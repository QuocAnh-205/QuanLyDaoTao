package uni.it.stdmanager.modules.i_auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * DTO request để Admin tạo hoặc cập nhật tài khoản người dùng.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserRequest {

    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50, message = "Username phải từ 3 đến 50 ký tự")
    private String username;

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 100, message = "Họ tên không quá 100 ký tự")
    private String fullName;

    @Email(message = "Email không đúng định dạng")
    private String email;

    @Size(max = 20, message = "Số điện thoại không quá 20 ký tự")
    private String phone;

    /**
     * Mật khẩu — bắt buộc khi TẠO MỚI, không bắt buộc khi CẬP NHẬT.
     * Nếu null/blank khi update thì giữ nguyên mật khẩu cũ.
     */
    private String password;

    private Boolean isActive;
}
