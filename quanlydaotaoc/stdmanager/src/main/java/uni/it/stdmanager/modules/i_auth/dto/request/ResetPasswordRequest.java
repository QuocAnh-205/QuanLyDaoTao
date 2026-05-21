package uni.it.stdmanager.modules.i_auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @Email(message = "INVALID_EMAIL")
    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Mã OTP không được để trống")
    private String otp;

    @Size(min = 8, message = "INVALID_PASSWORD")
    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;
}
