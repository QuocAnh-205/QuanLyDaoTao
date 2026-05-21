package uni.it.stdmanager.modules.vii_tuition.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.v_semester.entity.Semester;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_tuition")
public class StudentTuition extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tuition_fee_id")
    private TuitionFee tuitionFee;

    @Column(name = "total_credits")
    private Integer totalCredits;

    @Column(name = "raw_amount", precision = 15, scale = 2)
    private BigDecimal rawAmount;

    @Column(name = "scholarship_deduction", precision = 15, scale = 2)
    private BigDecimal scholarshipDeduction;

    @Column(name = "exemption_amount", precision = 15, scale = 2)
    private BigDecimal exemptionAmount;

    @Column(name = "net_amount", precision = 15, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "paid_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "debt_amount", precision = 15, scale = 2)
    private BigDecimal debtAmount;

    @Column(name = "status", columnDefinition = "tinyint")
    private Integer status; // 1-PAID, 2-PARTIAL, 3-DEBT, 4-OVERDUE

    @Column(name = "deadline")
    private LocalDate deadline;
}
