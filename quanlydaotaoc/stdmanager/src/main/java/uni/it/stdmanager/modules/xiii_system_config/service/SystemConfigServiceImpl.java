package uni.it.stdmanager.modules.xiii_system_config.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.exception.ResourceNotFoundException;
import uni.it.stdmanager.modules.xiii_system_config.dto.request.SystemConfigSaveRequest;
import uni.it.stdmanager.modules.xiii_system_config.dto.response.SystemConfigResponse;
import uni.it.stdmanager.modules.xiii_system_config.entity.SystemConfig;
import uni.it.stdmanager.modules.xiii_system_config.repository.SystemConfigRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemConfigServiceImpl implements SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SystemConfigResponse> getAllConfigs() {
        return systemConfigRepository.findAll().stream()
                .filter(config -> config.getIsActive() == null || config.getIsActive())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SystemConfigResponse getConfigByKey(String key) {
        SystemConfig config = systemConfigRepository.findByConfigKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình với từ khóa: " + key));
        return mapToResponse(config);
    }

    @Override
    @Transactional
    public List<SystemConfigResponse> saveConfigs(List<SystemConfigSaveRequest> requests) {
        List<SystemConfigResponse> savedResponses = new ArrayList<>();
        for (SystemConfigSaveRequest request : requests) {
            if (request.getConfigKey() == null || request.getConfigKey().trim().isEmpty()) {
                continue;
            }
            SystemConfig config = systemConfigRepository.findByConfigKey(request.getConfigKey())
                    .orElseGet(() -> SystemConfig.builder().configKey(request.getConfigKey()).build());
            
            config.setConfigValue(request.getConfigValue());
            if (request.getDescription() != null) {
                config.setDescription(request.getDescription());
            }
            config.setIsActive(true);
            
            SystemConfig saved = systemConfigRepository.save(config);
            savedResponses.add(mapToResponse(saved));
        }
        return savedResponses;
    }

    private SystemConfigResponse mapToResponse(SystemConfig config) {
        return SystemConfigResponse.builder()
                .id(config.getId())
                .configKey(config.getConfigKey())
                .configValue(config.getConfigValue())
                .description(config.getDescription())
                .createdAt(config.getCreatedAt())
                .updatedAt(config.getUpdatedAt())
                .build();
    }
}
