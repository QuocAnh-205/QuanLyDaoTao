package uni.it.stdmanager.modules.ii_student.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.iv_course.entity.Major;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_classes")
public class StudentClass extends BaseEntity {

    @Column(name = "class_code", nullable = false, unique = true, length = 20)
    private String classCode;

    @Column(name = "class_name", nullable = false, length = 100)
    private String className;

    @Column(name = "course_year", length = 20)
    private String courseYear; // Khóa học (VD: 2020)

    // Quan hệ với Major (Ngành học - Module IV)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id")
    private Major major;

    // Quan hệ với Department (Khoa/Viện - Module III)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    // Quan hệ với Employee (Cố vấn học tập - Module III)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advisor_id")
    private Employee advisor;
}