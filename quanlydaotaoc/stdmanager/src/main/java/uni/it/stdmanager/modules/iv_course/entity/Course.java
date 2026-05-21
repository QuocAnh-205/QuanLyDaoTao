package uni.it.stdmanager.modules.iv_course.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "courses")
public class Course extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "course_code", length = 20)
    private String courseCode;

    @Column(name = "course_name", length = 255)
    private String courseName;

    @Column(name = "course_name_en", length = 255)
    private String courseNameEn;

    @Column(name = "credits", precision = 5, scale = 1)
    private BigDecimal credits;

    @Column(name = "course_type", length = 20)
    private String courseType; // VD: CoSoNganh, ChuyenNganh, DaiCuong

    @Column(name = "theory_hours", precision = 5, scale = 1)
    private BigDecimal theoryHours;

    @Column(name = "practice_hours", precision = 5, scale = 1)
    private BigDecimal practiceHours;

    @Column(name = "self_study_hours", precision = 5, scale = 1)
    private BigDecimal selfStudyHours;

    @Column(name = "internship_credits", precision = 5, scale = 1)
    private BigDecimal internshipCredits;

    @Lob
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
}
