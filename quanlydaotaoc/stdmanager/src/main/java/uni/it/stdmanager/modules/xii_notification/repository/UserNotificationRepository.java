package uni.it.stdmanager.modules.xii_notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.xii_notification.entity.UserNotification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, UUID> {

    List<UserNotification> findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(UUID userId);

    long countByUserIdAndIsReadFalseAndIsActiveTrue(UUID userId);

    Optional<UserNotification> findByIdAndUserIdAndIsActiveTrue(UUID id, UUID userId);

    List<UserNotification> findByUserIdAndIsReadFalseAndIsActiveTrue(UUID userId);
}
