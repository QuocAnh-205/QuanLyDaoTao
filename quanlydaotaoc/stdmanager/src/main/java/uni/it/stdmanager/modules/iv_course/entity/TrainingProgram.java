package uni.it.stdmanager.modules.iv_course.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "training_programs")
public class TrainingProgram extends BaseEntity {

    @Column(name = "program_code", length = 50)
    private String programCode;

    @Column(name = "program_name", length = 255)
    private String programName;

    @Column(name = "program_name_en", length = 255)
    private String programNameEn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id")
    private Major major;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "degree_level", length = 50)
    private String degreeLevel;

    @Column(name = "education_type", length = 50)
    private String educationType;

    @Column(name = "total_credits", precision = 5, scale = 1)
    private BigDecimal totalCredits;

    @Column(name = "required_credits", precision = 5, scale = 1)
    private BigDecimal requiredCredits;

    @Column(name = "elective_credits", precision = 5, scale = 1)
    private BigDecimal electiveCredits;

    @Column(name = "internship_credits", precision = 5, scale = 1)
    private BigDecimal internshipCredits;

    @Column(name = "thesis_credits", precision = 5, scale = 1)
    private BigDecimal thesisCredits;

    @Column(name = "admission_year")
    private LocalDate admissionYear;

    @Column(name = "duration_years", precision = 5, scale = 1)
    private BigDecimal durationYears;

    @Column(name = "max_duration_years", precision = 5, scale = 1)
    private BigDecimal maxDurationYears;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Lob
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Lob
    @Column(name = "objectives", columnDefinition = "NVARCHAR(MAX)")
    private String objectives;

    @Lob
    @Column(name = "learning_outcomes", columnDefinition = "NVARCHAR(MAX)")
    private String learningOutcomes;

    @Column(name = "version", length = 20)
    private String version;

    @Column(name = "status", length = 20)
    private String status;
}