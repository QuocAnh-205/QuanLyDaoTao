package uni.it.stdmanager.modules.viii_grade.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "grade_components")
public class GradeComponent extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_section_id", nullable = false)
    private CourseSection courseSection;

    @Column(name = "component_code", length = 20, nullable = false)
    private String componentCode;

    @Column(name = "component_name", length = 50, nullable = false)
    private String componentName;

    @Column(name = "weight_percentage", precision = 5, scale = 2)
    private BigDecimal weightPercentage;

    @Column(name = "min_score", precision = 4, scale = 2)
    private BigDecimal minScore;

    @Column(name = "max_score", precision = 4, scale = 2)
    private BigDecimal maxScore;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private Boolean isRequired = false;

    @Column(name = "allow_retake", nullable = false)
    @Builder.Default
    private Boolean allowRetake = false;

    @Column(name = "input_order")
    private Integer inputOrder;

    @Column(name = "note", length = 255)
    private String note;
}
