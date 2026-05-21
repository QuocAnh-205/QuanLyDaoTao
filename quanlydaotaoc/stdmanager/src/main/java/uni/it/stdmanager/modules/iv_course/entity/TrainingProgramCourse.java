package uni.it.stdmanager.modules.iv_course.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "training_program_courses")
public class TrainingProgramCourse extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "course_code", length = 50)
    private String courseCode;

    @Column(name = "course_name", length = 255)
    private String courseName;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "year")
    private Integer year;

    @Column(name = "is_required")
    private Boolean isRequired;

    @Column(name = "group_code", length = 50)
    private String groupCode;

    @Column(name = "credits", precision = 5, scale = 1)
    private BigDecimal credits;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prerequisite_course_id")
    private Course prerequisiteCourse;

    @Column(name = "is_prerequisite_required")
    private Boolean isPrerequisiteRequired;

    @Column(name = "note", length = 500)
    private String note;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "status", length = 20)
    private String status;
}
