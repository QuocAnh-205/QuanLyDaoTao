package uni.it.stdmanager.modules.viii_grade.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_component_grades")
public class StudentComponentGrade extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private CourseRegistration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private GradeComponent gradeComponent;

    @Column(name = "score", precision = 4, scale = 2)
    private BigDecimal score;

    @Column(name = "is_retake", nullable = false)
    @Builder.Default
    private Boolean isRetake = false;

    @Column(name = "is_locked", nullable = false)
    @Builder.Default
    private Boolean isLocked = false;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @Column(name = "graded_by")
    private UUID gradedBy;

    @Column(name = "note", length = 255)
    private String note;
}
