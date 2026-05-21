package uni.it.stdmanager.modules.iii_lecturer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iii_lecturer.dto.response.PositionResponse;
import uni.it.stdmanager.modules.iii_lecturer.service.PositionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
@Tag(name = "III. Lecturer Module", description = "API Quản lý Cán bộ Giảng viên")
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "2. Lấy danh sách Chức danh", description = "Lấy danh sách chức danh/vị trí công tác (cho dropdown)")
    public ApiResponse<List<PositionResponse>> getAllActivePositions() {
        return ApiResponse.success(positionService.getAllActivePositions(), "Lấy danh sách chức danh thành công");
    }
}
