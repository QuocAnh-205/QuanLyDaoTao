package uni.it.stdmanager.modules.ii_student.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_status")
public class StudentStatus extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "status_code", length = 50)
    private String statusCode; // ACTIVE, RESERVED, DROPPED, GRADUATED

    @Column(name = "status_name", length = 100)
    private String statusName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "reason", length = 255)
    private String reason;
}