package uni.it.stdmanager.modules.viii_grade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.viii_grade.entity.StudentComponentGrade;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentComponentGradeRepository extends JpaRepository<StudentComponentGrade, UUID> {
    List<StudentComponentGrade> findAllByRegistrationIdAndIsActiveTrue(UUID registrationId);
    Optional<StudentComponentGrade> findByRegistrationIdAndGradeComponentIdAndIsActiveTrue(UUID registrationId, UUID componentId);
    List<StudentComponentGrade> findAllByRegistrationIdInAndIsActiveTrue(List<UUID> registrationIds);
}
