package uni.it.stdmanager.modules.xiii_system_config.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemConfigSaveRequest {
    private String configKey;
    private String configValue;
    private String description;
}
