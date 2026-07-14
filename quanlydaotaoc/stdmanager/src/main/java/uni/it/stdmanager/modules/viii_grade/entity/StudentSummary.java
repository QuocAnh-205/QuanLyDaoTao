package uni.it.stdmanager.modules.viii_grade.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_summaries")
public class StudentSummary extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private CourseRegistration registration;

    @Column(name = "total_score", precision = 4, scale = 2)
    private BigDecimal totalScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scale_id")
    private GradeScale gradeScale;

    @Column(name = "letter_grade", length = 2)
    private String letterGrade;

    @Column(name = "gpa_value", precision = 3, scale = 2)
    private BigDecimal gpaValue;

    @Column(name = "result", length = 10)
    private String result; // PASS, FAIL

    @Column(name = "is_finalized", nullable = false)
    @Builder.Default
    private Boolean isFinalized = false;
}
