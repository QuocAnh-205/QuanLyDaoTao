package uni.it.stdmanager.modules.ii_student.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.ii_student.entity.StudentClass;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, UUID> {

    Optional<StudentClass> findByClassCode(String classCode);

    List<StudentClass> findAllByMajorId(UUID majorId);

    List<StudentClass> findAllByDepartmentId(UUID departmentId);

    boolean existsByClassCode(String classCode);
}