package uni.it.stdmanager.modules.viii_grade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.viii_grade.entity.StudentSummary;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentSummaryRepository extends JpaRepository<StudentSummary, UUID> {
    Optional<StudentSummary> findByRegistrationId(UUID registrationId);
    List<StudentSummary> findAllByRegistrationStudentIdAndIsActiveTrue(UUID studentId);
}
