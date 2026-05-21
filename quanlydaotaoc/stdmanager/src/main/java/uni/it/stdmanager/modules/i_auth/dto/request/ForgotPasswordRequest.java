package uni.it.stdmanager.modules.i_auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {
    @Email(message = "INVALID_EMAIL")
    @NotBlank(message = "Email không được để trống")
    private String email;
}
