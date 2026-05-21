package uni.it.stdmanager.modules.vi_registration.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Thực thể lưu trữ thông tin đăng ký môn học của sinh viên.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "course_registrations")
public class CourseRegistration extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_section_id", nullable = false)
    private CourseSection courseSection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_period_id", nullable = false)
    private RegistrationPeriod registrationPeriod;

    @Column(name = "registration_type", nullable = false, columnDefinition = "tinyint")
    private Integer registrationType; // 1: Học mới; 2: Học lại; 3: Cải thiện

    @Column(name = "replaced_grade_id")
    private UUID replacedGradeId;

    @Column(name = "registered_at")
    @Builder.Default
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(name = "status", columnDefinition = "tinyint")
    @Builder.Default
    private Integer status = 1; // 1: Thành công; 2: Chờ thanh toán; 3: Đã hủy

    @Column(name = "is_paid")
    @Builder.Default
    private Boolean isPaid = false;
}
