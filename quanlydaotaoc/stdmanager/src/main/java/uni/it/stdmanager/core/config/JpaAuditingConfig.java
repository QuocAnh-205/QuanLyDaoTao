package uni.it.stdmanager.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import java.util.UUID;

/**
 * Cấu hình kích hoạt JPA Auditing cho toàn bộ dự án.
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfig {

    /**
     * Khởi tạo bean AuditorAware để JPA sử dụng khi gặp các annotation
     * 
     * @CreatedBy hoặc @LastModifiedBy.
     */
    @Bean
    public AuditorAware<UUID> auditorProvider() {
        return new AuditorAwareImpl();
    }
}