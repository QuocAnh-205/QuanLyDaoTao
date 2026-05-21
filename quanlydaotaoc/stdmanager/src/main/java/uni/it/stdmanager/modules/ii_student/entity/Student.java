package uni.it.stdmanager.modules.ii_student.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iv_course.entity.Major;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgram;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "students")
public class Student extends BaseEntity {

    // Quan hệ 1-1 với tài khoản User (Module I)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "student_code", nullable = false, unique = true, length = 20)
    private String studentCode;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 10)
    private String gender; // 1: Nam, 2: Nữ, 0: Khác

    @Column(name = "personal_identification_number", length = 20)
    private String personalIdentificationNumber; // CMND/CCCD

    @Column(name = "date_of_issue")
    private LocalDate dateOfIssue;

    @Column(name = "card_place", length = 100)
    private String cardPlace;

    @Column(name = "address", length = 300)
    private String address;

    @Column(name = "current_address", length = 300)
    private String currentAddress;

    // Liên kết với Lớp hành chính
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private StudentClass studentClass;

    // Các liên kết khác (Module III, IV)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id")
    private Major major;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id")
    private TrainingProgram program;

    // Liên kết trạng thái hiện tại (bảo lưu, đang học...)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    private StudentStatus currentStatus;

    @Column(name = "admission_year")
    private Integer admissionYear;
}