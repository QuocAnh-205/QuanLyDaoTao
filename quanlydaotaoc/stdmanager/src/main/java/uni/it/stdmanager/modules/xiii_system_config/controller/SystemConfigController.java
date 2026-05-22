package uni.it.stdmanager.modules.xiii_system_config.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.xiii_system_config.dto.request.SystemConfigSaveRequest;
import uni.it.stdmanager.modules.xiii_system_config.dto.response.SystemConfigResponse;
import uni.it.stdmanager.modules.xiii_system_config.service.SystemConfigService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/system-configs")
@RequiredArgsConstructor
@Tag(name = "XIII. System Config Module", description = "API Cấu hình Hệ thống")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @GetMapping
    @Operation(summary = "1. Lấy tất cả cấu hình hệ thống", description = "Lấy toàn bộ danh sách cấu hình hệ thống hiện tại")
    public ApiResponse<List<SystemConfigResponse>> getAllConfigs() {
        List<SystemConfigResponse> response = systemConfigService.getAllConfigs();
        return ApiResponse.success(response, "Lấy danh sách cấu hình hệ thống thành công");
    }

    @GetMapping("/{key}")
    @Operation(summary = "2. Lấy cấu hình hệ thống theo từ khóa", description = "Lấy một cấu hình hệ thống cụ thể theo key")
    public ApiResponse<SystemConfigResponse> getConfigByKey(@PathVariable String key) {
        SystemConfigResponse response = systemConfigService.getConfigByKey(key);
        return ApiResponse.success(response, "Lấy cấu hình " + key + " thành công");
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "3. Cập nhật hàng loạt cấu hình hệ thống", description = "Cập nhật hoặc thêm mới nhiều cấu hình hệ thống cùng lúc (Chỉ dành cho ADMIN)")
    public ApiResponse<List<SystemConfigResponse>> saveConfigs(@RequestBody List<SystemConfigSaveRequest> requests) {
        List<SystemConfigResponse> response = systemConfigService.saveConfigs(requests);
        return ApiResponse.success(response, "Cập nhật cấu hình hệ thống thành công");
    }
}
