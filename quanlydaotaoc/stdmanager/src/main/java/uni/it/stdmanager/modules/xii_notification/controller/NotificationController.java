package uni.it.stdmanager.modules.xii_notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.xii_notification.dto.response.NotificationResponse;
import uni.it.stdmanager.modules.xii_notification.service.NotificationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "XII. Notification Module", description = "API Quản lý Thông báo và Hệ thống")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "1. Lấy danh sách thông báo", description = "Lấy toàn bộ danh sách thông báo của người dùng hiện tại đang đăng nhập")
    public ApiResponse<List<NotificationResponse>> getMyNotifications() {
        List<NotificationResponse> response = notificationService.getMyNotifications();
        return ApiResponse.success(response, "Lấy danh sách thông báo thành công");
    }

    @GetMapping("/unread-count")
    @Operation(summary = "2. Đếm thông báo chưa đọc", description = "Đếm tổng số lượng thông báo chưa đọc để hiển thị Badge")
    public ApiResponse<Long> getUnreadCount() {
        long response = notificationService.getUnreadCount();
        return ApiResponse.success(response, "Lấy số lượng thông báo chưa đọc thành công");
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "3. Đánh dấu đã đọc một thông báo", description = "Đổi trạng thái của thông báo cụ thể sang đã đọc")
    public ApiResponse<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ApiResponse.success(null, "Đánh dấu đã đọc thành công");
    }

    @PutMapping("/read-all")
    @Operation(summary = "4. Đánh dấu đã đọc tất cả", description = "Đổi trạng thái của tất cả thông báo sang đã đọc")
    public ApiResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.success(null, "Đánh dấu tất cả đã đọc thành công");
    }
}
