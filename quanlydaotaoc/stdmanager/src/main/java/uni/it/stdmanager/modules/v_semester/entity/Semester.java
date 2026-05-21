package uni.it.stdmanager.modules.v_semester.entity;

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
@Table(name = "semesters")
public class Semester extends BaseEntity {

    @Column(name = "semester_code", length = 50, unique = true, nullable = false)
    private String semesterCode;

    @Column(name = "semester_name", length = 100, nullable = false)
    private String semesterName;

    @Column(name = "academic_year", length = 20, nullable = false)
    private String academicYear;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
