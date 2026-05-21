package uni.it.stdmanager.modules.i_auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationRequest {
    @Size(min = 3, message = "USERNAME_INVALID")
    private String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
    private String password;

    @NotBlank(message = "FIELD_REQUIRED")
    private String fullName;

    @Email(message = "INVALID_EMAIL")
    private String email;

    private Set<String> roles; // Danh sách các mã Role (ADMIN, GIANGVIEN...)
}