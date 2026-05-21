package uni.it.stdmanager.modules.i_auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @Size(min = 3, message = "USERNAME_INVALID")
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @Email(message = "INVALID_EMAIL")
    @NotBlank(message = "Email không được để trống")
    private String email;

    private String phone;
}
