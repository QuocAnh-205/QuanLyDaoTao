package uni.it.stdmanager.modules.i_auth.dto.response;

import lombok.*;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private boolean authenticated;
    private UserResponse user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private String username;
        private String fullName;
        private String email;
        private String avatarUrl;
        private Set<String> roles;
    }
}