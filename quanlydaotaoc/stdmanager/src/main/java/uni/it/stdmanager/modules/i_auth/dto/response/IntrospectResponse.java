package uni.it.stdmanager.modules.i_auth.dto.response;

import lombok.*;

// Response
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntrospectResponse {
    private boolean valid;
}