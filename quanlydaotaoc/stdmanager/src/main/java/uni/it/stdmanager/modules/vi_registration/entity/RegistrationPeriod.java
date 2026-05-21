package uni.it.stdmanager.modules.vi_registration.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.v_semester.entity.Semester;

import java.time.LocalDateTime;

/**
 * Thực thể quản lý các đợt đăng ký môn học trong một học kỳ.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "registration_periods")
public class RegistrationPeriod extends BaseEntity {

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "target_config", columnDefinition = "NVARCHAR(MAX)")
    private String targetConfig; // Cấu hình đối tượng dạng JSON (Khóa, Khoa...)

    @Builder.Default
    @Column(name = "max_credits", columnDefinition = "tinyint")
    private Integer maxCredits = 25;

    @Builder.Default
    @Column(name = "min_credits", columnDefinition = "tinyint")
    private Integer minCredits = 12;

    @Builder.Default
    @Column(name = "allow_retake")
    private Boolean allowRetake = true;
}
