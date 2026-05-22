package uni.it.stdmanager.modules.xii_notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.security.SecurityUtils;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.xii_notification.dto.response.NotificationResponse;
import uni.it.stdmanager.modules.xii_notification.entity.Notification;
import uni.it.stdmanager.modules.xii_notification.entity.UserNotification;
import uni.it.stdmanager.modules.xii_notification.repository.NotificationRepository;
import uni.it.stdmanager.modules.xii_notification.repository.UserNotificationRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;
    private final UserRepository userRepository;

    /**
     * Lấy danh sách thông báo của người dùng hiện tại đang đăng nhập.
     * Nếu trống, tự động sinh (seed) các thông báo mẫu.
     */
    @Transactional
    public List<NotificationResponse> getMyNotifications() {
        User user = getCurrentUser();
        List<UserNotification> userNotifications = userNotificationRepository
                .findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(user.getId());

        if (userNotifications.isEmpty()) {
            userNotifications = seedDefaultNotifications(user);
        }

        return userNotifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Đếm số lượng thông báo chưa đọc của người dùng hiện tại.
     */
    public long getUnreadCount() {
        User user = getCurrentUser();
        return userNotificationRepository.countByUserIdAndIsReadFalseAndIsActiveTrue(user.getId());
    }

    /**
     * Đánh dấu một thông báo cụ thể là đã đọc.
     */
    @Transactional
    public void markAsRead(UUID id) {
        User user = getCurrentUser();
        UserNotification userNotification = userNotificationRepository
                .findByIdAndUserIdAndIsActiveTrue(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông báo hoặc bạn không có quyền truy cập"));

        if (!userNotification.getIsRead()) {
            userNotification.setIsRead(true);
            userNotification.setReadAt(LocalDateTime.now());
            userNotificationRepository.save(userNotification);
        }
    }

    /**
     * Đánh dấu tất cả thông báo của người dùng hiện tại là đã đọc.
     */
    @Transactional
    public void markAllAsRead() {
        User user = getCurrentUser();
        List<UserNotification> unreadNotifications = userNotificationRepository
                .findByUserIdAndIsReadFalseAndIsActiveTrue(user.getId());

        LocalDateTime now = LocalDateTime.now();
        for (UserNotification unread : unreadNotifications) {
            unread.setIsRead(true);
            unread.setReadAt(now);
        }
        userNotificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Lấy thông tin user hiện tại từ Security Context.
     */
    private User getCurrentUser() {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("Người dùng chưa đăng nhập hoặc Token không hợp lệ"));

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông báo cho tài khoản: " + username));
    }

    /**
     * Khởi tạo dữ liệu thông báo mẫu nếu người dùng chưa có thông báo nào.
     */
    private List<UserNotification> seedDefaultNotifications(User user) {
        log.info("Khởi tạo thông báo mẫu (Seeding) cho người dùng: {}", user.getUsername());
        List<UserNotification> seeded = new ArrayList<>();

        // Thông báo 1: Chào mừng
        Notification welcomeNotif = Notification.builder()
                .title("Chào mừng bạn đến với STD MANAGER 🎉")
                .content("Tài khoản của bạn đã được kích hoạt thành công trên hệ thống Quản lý Đào tạo Standard Manager. Hãy hoàn thiện thông tin cá nhân trong mục Profile.")
                .typeId(UUID.randomUUID())
                .build();
        welcomeNotif.setIsActive(true);
        welcomeNotif.setCreatedAt(LocalDateTime.now().minusHours(2));
        notificationRepository.save(welcomeNotif);

        UserNotification welcomeUserNotif = UserNotification.builder()
                .user(user)
                .notification(welcomeNotif)
                .isRead(false)
                .build();
        welcomeUserNotif.setIsActive(true);
        welcomeUserNotif.setCreatedAt(LocalDateTime.now().minusHours(2));
        userNotificationRepository.save(welcomeUserNotif);
        seeded.add(welcomeUserNotif);

        // Thông báo 2: Nhắc học phí
        Notification tuitionNotif = Notification.builder()
                .title("Nhắc nhở hoàn thành học phí Học kỳ I 💳")
                .content("Hệ thống ghi nhận bạn có hóa đơn học phí Học kỳ I chưa được thanh toán hoàn toàn. Vui lòng thanh toán trước ngày hạn định để tránh bị khóa đăng ký học phần.")
                .typeId(UUID.randomUUID())
                .build();
        tuitionNotif.setIsActive(true);
        tuitionNotif.setCreatedAt(LocalDateTime.now().minusDays(1));
        notificationRepository.save(tuitionNotif);

        UserNotification tuitionUserNotif = UserNotification.builder()
                .user(user)
                .notification(tuitionNotif)
                .isRead(false)
                .build();
        tuitionUserNotif.setIsActive(true);
        tuitionUserNotif.setCreatedAt(LocalDateTime.now().minusDays(1));
        userNotificationRepository.save(tuitionUserNotif);
        seeded.add(tuitionUserNotif);

        // Thông báo 3: Đăng ký học phần
        Notification courseNotif = Notification.builder()
                .title("Đăng ký học phần Học kỳ mới 📚")
                .content("Cổng đăng ký học phần trực tuyến cho Học kỳ mới sẽ chính thức mở vào lúc 08:00 sáng thứ Hai tuần tới. Hãy lên lịch và chuẩn bị danh sách học phần của bạn.")
                .typeId(UUID.randomUUID())
                .build();
        courseNotif.setIsActive(true);
        courseNotif.setCreatedAt(LocalDateTime.now().minusDays(3));
        notificationRepository.save(courseNotif);

        UserNotification courseUserNotif = UserNotification.builder()
                .user(user)
                .notification(courseNotif)
                .isRead(true)
                .readAt(LocalDateTime.now().minusDays(2))
                .build();
        courseUserNotif.setIsActive(true);
        courseUserNotif.setCreatedAt(LocalDateTime.now().minusDays(3));
        userNotificationRepository.save(courseUserNotif);
        seeded.add(courseUserNotif);

        // Đảo ngược danh sách mẫu để thông báo mới nhất lên đầu khi hiển thị
        return userNotificationRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(user.getId());
    }

    /**
     * Map UserNotification Entity sang NotificationResponse DTO.
     */
    private NotificationResponse mapToResponse(UserNotification userNotification) {
        return NotificationResponse.builder()
                .id(userNotification.getId())
                .title(userNotification.getNotification().getTitle())
                .content(userNotification.getNotification().getContent())
                .isRead(userNotification.getIsRead())
                .createdAt(userNotification.getCreatedAt())
                .readAt(userNotification.getReadAt())
                .build();
    }
}
