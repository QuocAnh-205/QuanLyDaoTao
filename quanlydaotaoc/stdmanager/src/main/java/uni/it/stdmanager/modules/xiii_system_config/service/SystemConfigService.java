package uni.it.stdmanager.modules.xiii_system_config.service;

import uni.it.stdmanager.modules.xiii_system_config.dto.request.SystemConfigSaveRequest;
import uni.it.stdmanager.modules.xiii_system_config.dto.response.SystemConfigResponse;

import java.util.List;

public interface SystemConfigService {
    List<SystemConfigResponse> getAllConfigs();
    SystemConfigResponse getConfigByKey(String key);
    List<SystemConfigResponse> saveConfigs(List<SystemConfigSaveRequest> requests);
}
