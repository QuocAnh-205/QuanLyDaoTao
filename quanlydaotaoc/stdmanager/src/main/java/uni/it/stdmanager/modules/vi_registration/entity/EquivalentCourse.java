package uni.it.stdmanager.modules.vi_registration.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.iv_course.entity.Course;

import java.time.LocalDate;

/**
 * Thực thể quản lý các môn học tương đương hoặc thay thế.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "equivalent_courses")
public class EquivalentCourse extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_course_id", nullable = false)
    private Course originalCourse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equivalent_course_id", nullable = false)
    private Course equivalentCourse;

    @Column(name = "equivalence_type", nullable = false, columnDefinition = "tinyint")
    private Integer equivalenceType; // 1: Thay thế hoàn toàn; 2: Tương đương song song

    @Column(name = "effect_date")
    private LocalDate effectDate;

    @Column(name = "note", length = 500)
    private String note;
}
