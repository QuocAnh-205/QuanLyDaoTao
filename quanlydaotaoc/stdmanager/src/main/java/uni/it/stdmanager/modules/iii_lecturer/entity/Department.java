package uni.it.stdmanager.modules.iii_lecturer.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "departments")
public class Department extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 10)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String departmentName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "established_year")
    private Integer establishedYear;
}