package uni.it.stdmanager.modules.ii_student.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.ii_student.entity.StudentStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentStatusRepository extends JpaRepository<StudentStatus, UUID> {

    List<StudentStatus> findAllByStudentIdOrderByStartDateDesc(UUID studentId);

    @Query("SELECT ss FROM StudentStatus ss WHERE ss.student.id = :studentId AND ss.isActive = true")
    Optional<StudentStatus> findCurrentActiveStatusByStudentId(@Param("studentId") UUID studentId);
}