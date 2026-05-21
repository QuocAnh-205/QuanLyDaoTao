package uni.it.stdmanager.modules.vii_tuition.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgram;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tuition_fees")
public class TuitionFee extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id")
    private TrainingProgram program;

    @Column(name = "course_year", length = 10)
    private String courseYear;

    @Column(name = "price_per_credit", precision = 15, scale = 2)
    private BigDecimal pricePerCredit;

    @Column(name = "base_tuition", precision = 15, scale = 2)
    private BigDecimal baseTuition;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;
}
