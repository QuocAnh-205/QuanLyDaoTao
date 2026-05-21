package uni.it.stdmanager.core.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.UUID;

/**
 * Triển khai AuditorAware để lấy UUID của người dùng hiện tại từ
 * SecurityContext.
 * Dùng để tự động hóa các trường createdBy và updatedBy trong BaseEntity.
 */
@Component
public class AuditorAwareImpl implements AuditorAware<UUID> {

    @Override
    public Optional<UUID> getCurrentAuditor() {
        // 1. Lấy thông tin Authentication từ SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. Kiểm tra nếu chưa đăng nhập hoặc là người dùng vô danh (anonymous)
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return Optional.empty();
        }

        // 3. Trích xuất ID người dùng.
        // Giả định logic: ID được lưu trong Principal (Custom UserDetails) hoặc là
        // chuỗi UUID
        try {
            // Trong thực tế, bạn sẽ cast authentication.getPrincipal() về CustomUserDetails
            // của bạn
            // Ở đây giả định định danh là chuỗi UUID hợp lệ
            String userId = authentication.getName();
            return Optional.of(UUID.fromString(userId));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}